"use client";
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import ResultWithSources from "../components/ResultWithSources";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";

const ContentGenerator = () => {
	// Follw up: Write me a tweet about pedro pascal.
	const [prompt, setPrompt] = useState("https://www.youtube.com/watch?v=O_9JoimRj8w");
	const [topic, setTopic] = useState("Pedro Pascal");
	const [error, setError] = useState(null);
	const [firstMsg, setFirstMsg] = useState(true);
	const [messages, setMessages] = useState([
		{
			text: "Hi there! I'm your personal YouTube video script generator. If you give me a YouTube URL and topic, I can transform it into a unique video script. Send me a YouTube URL to get started.",
		},
	]);

	const handlePromptChange = (e) => {
		setPrompt(e.target.value);
	};
	const handleTopicChange = (e) => {
		setTopic(e.target.value);
	};

	// Make sure to change the API route
	const handleSubmit = async () => {
		try {
			// Push the user's message into the messages array
			setMessages((prevMessages) => [...prevMessages, { text: prompt, type: "user", sourceDocuments: null }]);

			const response = await fetch(`/api/content-generator`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: prompt, topic: topic, firstMsg }),
			});
			if (!response.ok) {
				console.error(`Error: ${response.status}`); // log the HTTP status code
				const errorMessage = await response.text(); // get the error message from the response
				console.error(`Message: ${errorMessage}`); // log the error message
				throw new Error(errorMessage);
			}

			const searchRes = await response.json();

			console.log({ searchRes });

			if (!response.ok) {
				throw new Error(searchRes.error);
			}

			// Push the response into the messages array
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: searchRes.output.text,
					type: "bot",
				},
			]);
			setFirstMsg(false);
			setPrompt("");
			setError("");
		} catch (err) {
			console.error(err);
			setError("Error fetching transcript. Please try again.");
		}
	};

	return (
		<>
			<Title emoji="🧙🏾‍♂️" headingText="AI Content Generator" />
			<TwoColumnLayout
				leftChildren={
					<>
						<PageHeader
							heading="Automated Content Generator"
							boldText="Doing your own manual research is so 2022. Let's automate it."
							description="This tool uses the agents to create a unique video script for you."
						/>
					</>
				}
				rightChildren={
					<>
						{/* Added max messages */}
						<ResultWithSources messages={messages} pngFile="wizard" maxMsgs={3} />
						<PromptBox
							prompt={topic}
							handlePromptChange={handleTopicChange}
							handleSubmit={handleSubmit}
							error={error}
							placeHolderText={"Enter a topic"}
							disableButton={true}
							labelText="Topic"
						/>
						<PromptBox
							prompt={prompt}
							handlePromptChange={handlePromptChange}
							handleSubmit={handleSubmit}
							placeHolderText={
								messages.length === 1 ? "Enter a youtube url, e.g., https://www.youtube.com/watch?v=O_9JoimRj8w" : "Ask a follow up question"
							}
							error={error}
							labelText="Chat"
						/>
					</>
				}
			/>
		</>
	);
};

export default ContentGenerator;