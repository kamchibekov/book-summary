import React, { useState, useEffect, useContext } from "react";
import { Book } from "../config/types";
import { fetchBook } from "../api/books.api";
import { DashboardContext } from "../contexts";
import BookCard from "./BookCard";
import URL from "../config/routes";

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
			{book && <BookCard book={book} url={URL.Book} />}
		</>
	);
}

export default TodaysBook;