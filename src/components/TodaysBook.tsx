import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "../contexts";
import { fetchBook } from "../api/books.api";
import BookCard from "./BookCard";
import { Book } from "../config/types";

function TodaysBook() {

	const [book, setBook] = useState<null | Book>(null);

	const { user } = useContext(DashboardContext)

	// Fetch todays book
	useEffect(() => {
		const fetchTodaysBook = async () => {
			const fetchedBook = await fetchBook(user);
			setBook(fetchedBook);
			console.log("Todays books fetched")
		};

		fetchTodaysBook();
	}, [user]);

	return (
		<>
			{book && <BookCard book={book} />}
		</>
	);
}

export default TodaysBook;