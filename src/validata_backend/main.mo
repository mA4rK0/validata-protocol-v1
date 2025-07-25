import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Int "mo:base/Int";

actor class TaskManager() {
    // Task Object
    type Task = {
        id : Nat;
        name : Text;
        taskType: Text;
        description: Text;
        qualityThreshold: Text;
        createdAt: Int; 
        companyId : Text;
        workerIds : [Text]; 
        rewardPerLabel : Nat; 
        totalItems : Nat; 
        prize : Nat;
        completedItems : Nat;
        valid : Bool;
        progress : Int;
        claimed : Bool;
        labelerCount: Nat;
        avgAccuracy: Float;
        dataset: [Nat8];
    };

    public type UserRole = {
        #Client;
        #Labeler;
        #Admin;
    };

    public type UserProfile = {
        id : Text;
        balance : Nat;
        tasksCompleted : Nat;
        role : UserRole;
    };
    
    var userProfiles = HashMap.HashMap<Text, UserProfile>(0, Text.equal, Text.hash);
    let tasks = HashMap.HashMap<Text, Task>(0, Text.equal, Text.hash);
    var presentId : Nat = 0;

    func get_or_create_profile(userId : Text) : UserProfile {
        switch (userProfiles.get(userId)) {
            case (?profile) { profile };
            case (null) {
                let newProfile : UserProfile = {
                    id = userId;
                    balance = 50_000_000_000;
                    tasksCompleted = 0;
                    role = #Client;
                };
                userProfiles.put(userId, newProfile);
                newProfile
            };
        };
    };

    public query func getCompanyTasks(companyId: Text) : async [Task] {
        let allTasks = tasks.entries();

        let companyTasks = Iter.filter(
            allTasks, 
            func ((_id, task) : (Text, Task)) : Bool {
                task.companyId == companyId
            }
        );

        let tasksOnly = Iter.map(
            companyTasks,
            func ((_id, task) : (Text, Task)) : Task { task }
        );

        Iter.toArray(tasksOnly);
    };

    public shared({caller}) func updateProgress(taskId: Text, completedItems: Nat) : async Result.Result<(), Text> {
        switch (tasks.get(taskId)) {
            case null { 
                return #err("Task not found"); 
            };
            case (?task) {
                let workerId = Principal.toText(caller);
            
                if (Array.find(task.workerIds, func (id : Text) : Bool { id == workerId }) != null) { () } else {
                    return #err("Unauthorized: Only assigned workers can update progress");
                };

                if (completedItems > task.totalItems) {
                    return #err("Completed items cannot exceed total items");
                };

                let progressValue : Int = if (task.totalItems > 0) {
                    let percent = (completedItems * 100) / task.totalItems;
                    percent;
                } else {
                    0
                };

                let updatedTask = {
                    task with
                    completedItems = completedItems;
                    progress = progressValue;
                };

                tasks.put(taskId, updatedTask);
                #ok(())
            }
        }
    };

    public shared({caller}) func makeTask(name: Text, taskType: Text, description: Text, qualityThreshold: Text, totalItems: Nat, rewardPerLabel: Nat, dataset: [Nat8]) : async Result.Result<Text, Text> {
        let companyId = Principal.toText(caller);
        
        if (totalItems <= 0) {
            return #err("Total items must be positive");
        };
        if (name == "") {
            return #err("Task name required");
        };
        if (rewardPerLabel <= 0) {
            return #err("Reward per label must be positive");
        };
        if (qualityThreshold == "") {
            return #err("Quality threshold required");
        };
        if (dataset.size() == 0) {
            return #err("Dataset required");
        };

        let prize = totalItems * rewardPerLabel;

        let companyProfile = get_or_create_profile(companyId);
        if (companyProfile.balance < prize) {
            return #err("Insufficient company balance");
        };

        let updatedBalance = companyProfile.balance - prize;
        assert(updatedBalance >= 0);

        if (updatedBalance < 0) {
            return #err("Insufficient company balance");
        };
        let updatedCompany = {
            companyProfile with 
            balance = updatedBalance;
        };
        userProfiles.put(companyId, updatedCompany);

        presentId += 1;
        let taskId = Nat.toText(presentId);
        
        let task : Task = {
            id = presentId;
            name = name;
            taskType = taskType;
            description = description;
            qualityThreshold = qualityThreshold;
            createdAt = Time.now();
            companyId = companyId;
            workerIds = [];
            rewardPerLabel = rewardPerLabel;
            totalItems = totalItems;
            prize = prize;
            completedItems = 0;
            valid = false;
            progress = 0;
            claimed = false;
            labelerCount = 0;
            avgAccuracy = 96.0;
            dataset = dataset;
        };

        tasks.put(taskId, task);
        
        #ok("Task created: " # taskId)
    };

    public shared({caller}) func takeTask(taskId : Text) : async Result.Result<Text, Text> {
    let workerId = Principal.toText(caller);
    
        switch (tasks.get(taskId)) {
                case null { #err("Task not found") };
                case (?task) {
                    // Periksa apakah worker sudah mengambil task ini
                    if (Array.find(task.workerIds, func (id : Text) : Bool { id == workerId }) != null) {
                        return #err("Task already taken");
                    };

                    // Tambahkan worker ke task
                    let updatedWorkerIds = Array.append(task.workerIds, [workerId]);
                    let updatedTask = {
                        task with 
                        workerIds = updatedWorkerIds
                    };
                    tasks.put(taskId, updatedTask);
                    #ok("Task taken")
                }
            }
    };

    public shared({caller}) func claimPartialReward(taskId: Text, itemsCompleted: Nat) : async Result.Result<Text, Text> {
        let workerId = Principal.toText(caller);

        switch (tasks.get(taskId)) {
            case null { 
                return #err("Task not found"); 
            };
            case (?task) {
                if (Array.find(task.workerIds, func (id : Text) : Bool { id == workerId }) == null) {
                    return #err("Unauthorized: Only assigned workers can claim rewards");
                };

                if (itemsCompleted == 0) {
                    return #err("Must complete at least 1 item");
                };
                
                let claimableItems = Nat.min(itemsCompleted, task.totalItems - task.completedItems);
                if (claimableItems == 0) {
                    return #err("No items available to claim");
                };
                
                let rewardAmount = claimableItems * task.rewardPerLabel;
                
                if (task.prize < rewardAmount) {
                    return #err("Insufficient funds in task escrow");
                };
                
                let workerProfile = get_or_create_profile(workerId);
                let updatedWorker = {
                    workerProfile with 
                    balance = workerProfile.balance + rewardAmount;
                    tasksCompleted = workerProfile.tasksCompleted + claimableItems;
                };
                userProfiles.put(workerId, updatedWorker);
                
                let newCompletedItems = claimableItems;
                let newProgress = if (task.totalItems > 0) {
                    Nat.div(Nat.mul(newCompletedItems, 100), task.totalItems)
                } else { 0 };
                
                let updatedTask = {
                    task with
                    completedItems = newCompletedItems;
                    progress = newProgress;
                    prize = if (task.prize >= rewardAmount) {
                        task.prize - rewardAmount
                    } else {
                        0
                    };
                };
                
                tasks.put(taskId, updatedTask);
                
                let rewardICP = Float.toText(Float.fromInt(rewardAmount) / 100_000_000.0) # " ICP";
                #ok("Claimed reward for " # Nat.toText(claimableItems) # " items: " # rewardICP)
            }
        }
    };

    public shared({caller}) func deposit(amount : Nat) : async () {
        let userId = Principal.toText(caller);
        let profile = get_or_create_profile(userId);
        userProfiles.put(userId, {profile with balance = profile.balance + amount});
    };

    public shared({caller}) func getBalance() : async Nat {
        let userId = Principal.toText(caller);
        switch (userProfiles.get(userId)) {
            case (?profile) { profile.balance };
            case (null) { 0 };
        }
    };

    public shared({caller}) func getLabelerTasks() : async [Task] {
        let workerId = Principal.toText(caller);
        let allTasks = Iter.toArray(tasks.vals());
        
        Array.filter(
            allTasks,
            func (task: Task) : Bool {
                Array.find(task.workerIds, func (id: Text) : Bool { id == workerId }) != null
            }
        );
    };

    public shared query func getTask(taskId : Text) : async ?Task {
        return tasks.get(taskId);
    };

    public query func getAllTasks() : async [Task] {
        Iter.toArray(tasks.vals())
    };

    public shared({caller}) func getMyProfile() : async ?UserProfile {
        let userId = Principal.toText(caller);
        return userProfiles.get(userId);
    };

    // Query to view a user's profile
    public shared func getProfile(userId: Text) : async ?UserProfile {
        return userProfiles.get(userId);
    };
};