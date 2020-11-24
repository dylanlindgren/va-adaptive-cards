import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom, createElementFromNode } from '@servicenow/ui-renderer-snabbdom';
import * as AdaptiveCards from "adaptivecards";
import markdownit from "markdown-it";
import styles from './styles.scss';

AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
	result.outputHtml = markdownit().render(text);
	result.didProcess = true;
};

var adaptiveCard = new AdaptiveCards.AdaptiveCard();

adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
	fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
});

adaptiveCard.onExecuteAction = function (action) { console.log("Ow!", action); }

const view = ({ properties }) => {
	adaptiveCard.parse(properties.controlData.card);
	var renderedCard = adaptiveCard.render();
	const adaptiveCardElement = createElementFromNode(renderedCard);
	return <div>{adaptiveCardElement}</div>;
};

createCustomElement('snc-wds-va-adaptive-cards', {
	renderer: { type: snabbdom },
	view,
	properties: {
		controlData: {
			default: {
				card: {
					"type": "AdaptiveCard",
					"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					"version": "1.3",
					"body": [
						{
							"type": "TextBlock",
							"text": "Placeholder for input-defined Adaptive Card.",
							"wrap": true
						}
					]
				}
			}
		},
		forceCloseControl: false,
		responseValue: {},
	},
	styles
});