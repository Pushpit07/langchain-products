import { sourceCodePro } from "./styles/fonts";

const Footer = () => {
	return (
		<footer className={`w-full p-4 bg-gray-800 text-white fixed bottom-0`}>
			<p className={`w-full text-center ${sourceCodePro.className}`}>
				built by{" "}
				<a href="https://twitter.com/Pushpit07" target="_blank" rel="noopener noreferrer" className="hover:underline">
					@Pushpit07
				</a>
			</p>
		</footer>
	);
};

export default Footer;
