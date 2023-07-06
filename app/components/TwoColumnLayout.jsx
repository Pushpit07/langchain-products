import React from "react";

const TwoColumnLayout = ({ leftChildren, rightChildren }) => (
	<div className="flex flex-col justify-between md:flex-row md:justify-between mt-10">
		{/* Description */}
		<div className="md:w-2/5 w-full">{leftChildren}</div>
		{/* Chat */}
		<div className="md:w-2/5 w-full pb-20">{rightChildren}</div>
	</div>
);

export default TwoColumnLayout;
