import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor Assistant {
	type Todo = {
		id: Nat;
		description : Text;
		isCompleted : Bool;
	};

	func getHashOfNat(n : Nat) : Hash.Hash {
		return Text.hash(Nat.toText(n));
	};

	var todos = HashMap.HashMap<Nat, Todo>(0, Nat.equal, getHashOfNat);
	var nextId : Nat = 1;

	public query func getTodosAsArray() : async [Todo] {
		return Iter.toArray(todos.vals());
	};

	public func addTodo(description : Text) : async Nat {
		let id = nextId;
		todos.put(id, { id = id; description = description; isCompleted = false });
		nextId += 1;
		return id;
	};

	public func completeTodo(id : Nat) : async () {
		ignore do ? {
			let description = todos.get(id)!.description;
			todos.put(id, { id; description; isCompleted = true });
		};
	};

	public func undoCompleteTodo(id : Nat) : async () {
		ignore do ? {
			let description = todos.get(id)!.description;
			todos.put(id, { id; description; isCompleted = false });
		};
	};

	public query func showTodos() : async Text {
		var output : Text = "\n==== TODOS ====";
		for (todo : Todo in todos.vals()) {
			output #= "\n(" # Nat.toText(todo.id) # ") " # todo.description;
			if (todo.isCompleted) {
				output #= " (✔)";
			};
		};
		output #= "\n";
		return output;
	};

	public func clearCompletedTodos() : async () {
		todos := HashMap.mapFilter<Nat, Todo, Todo>(
			todos,
			Nat.equal,
			getHashOfNat,
			func(_, todo) { if (todo.isCompleted) null else ?todo },
		);
	};
};
