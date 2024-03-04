import { motoko_tutorial_backend } from "declarations/motoko_tutorial_backend";
import { useEffect, useState } from "react";

function App() {
	const [todos, setTodos] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		const fetchedTodos = await motoko_tutorial_backend.getTodosAsArray();
		fetchedTodos.sort((a, b) => (a.id > b.id ? 1 : -1)); // Sort by id
		fetchedTodos.sort((a, b) => (!a.isUrgent && b.isUrgent ? 1 : -1)); // Sort by urgency
		setTodos(fetchedTodos);
	};

	const handleCompleteTodo = async (id) => {
		setIsProcessing(true);
		await motoko_tutorial_backend.completeTodo(id);
		await fetchTodos();
		setIsProcessing(false);
	};

	const handleUndoCompleteTodo = async (id) => {
		setIsProcessing(true);
		await motoko_tutorial_backend.undoCompleteTodo(id);
		await fetchTodos();
		setIsProcessing(false);
	};

	const handleClearCompletedTodos = async () => {
		setIsProcessing(true);
		await motoko_tutorial_backend.clearCompletedTodos();
		await fetchTodos();
		setIsProcessing(false);
	};

	const handleAddFormSubmit = async (event) => {
		event.preventDefault();

		setIsProcessing(true);
		const description = event.target.elements.description.value;
		const isUrgent = event.target.elements.isUrgent.checked;
		await motoko_tutorial_backend.addTodo(description, isUrgent);
		await fetchTodos();
		setIsProcessing(false);
	};

	let todosMarkup;
	if (todos && todos.length > 0) {
		todosMarkup = (
			<>
				{todos.map((todo) => (
					<div className="todo">
						<input
							key={todo.id}
							className="checkbox"
							type="checkbox"
							id={`todo-${todo.id}`}
							checked={todo.isCompleted}
							disabled={isProcessing}
							onChange={() =>
								todo.isCompleted
									? handleUndoCompleteTodo(todo.id)
									: handleCompleteTodo(todo.id)
							}
						/>
						<label className="todo-label" htmlFor={`todo-${todo.id}`}>
							{todo.isUrgent && <span className="todo-urgent-icon">⚠️</span>}
							<span>{todo.description}</span>
						</label>
					</div>
				))}
				<button
					className="clear-button button"
					type="button"
					disabled={isProcessing}
					onClick={handleClearCompletedTodos}
				>
					Clear Completed Todos
				</button>
			</>
		);
	} else if (todos === null) {
		todosMarkup = <p className="text-center">Loading...</p>;
	} else {
		todosMarkup = <p className="text-center">No todos. Add one now!</p>;
	}

	return (
		<main className="container">
			<img className="logo" src="/logo2.svg" alt="DFINITY logo" />

			<h1 className="heading text-center">
				Todos
				{isProcessing && " (Please wait...)"}
			</h1>
			{}
			<div className="todos">{todosMarkup}</div>

			<form className="add-form" onSubmit={handleAddFormSubmit}>
				<h2 className="m-0">Add Todo</h2>

				<label className="input-label" htmlFor="description">
					Description
				</label>
				<input
					className="text-input"
					id="description"
					name="description"
					type="text"
				/>

				<div>
					<input
						className="checkbox"
						id="isUrgent"
						name="isUrgent"
						type="checkbox"
					/>
					<label className="checkbox-label" htmlFor="isUrgent">
						⚠️ Urgent
					</label>
				</div>

				<button className="button" type="submit" disabled={isProcessing}>
					Add
				</button>
			</form>
		</main>
	);
}

export default App;
