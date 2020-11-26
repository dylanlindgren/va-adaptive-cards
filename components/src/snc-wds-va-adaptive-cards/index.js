import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom, createElementFromNode } from '@servicenow/ui-renderer-snabbdom';
import {createHttpEffect} from '@servicenow/ui-effect-http';
import { actionHandlers } from './actionHandlers.js';
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import * as blankCard from './blankCard.json';
import markdownit from "markdown-it";
import styles from './styles.scss';
import { CARD_SUBMITTED, URL_OPENED } from './constants.js'

AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
	result.outputHtml = markdownit().render(text);
	result.didProcess = true;
};

var adaptiveCard = new AdaptiveCards.AdaptiveCard();

const view = (state, {dispatch}) => {

	const {properties, controlClosed} = state;

	if (controlClosed) {
		return <div></div>
	}

	adaptiveCard.onExecuteAction = function (action) {
		console.log(action.data);
		const actionData = action._propertyBag;
		if (actionData.type === 'Action.OpenUrl') {
			dispatch(URL_OPENED, actionData);
		} else if (actionData.type === 'Action.Submit') {
			dispatch(CARD_SUBMITTED, actionData);
		}
	};

	var template = new ACData.Template(properties.controlData.cardTemplate);
	var cardPayload = template.expand({$root: properties.controlData.cardData});
	adaptiveCard.parse(cardPayload);
	const renderedCard = adaptiveCard.render();

	return <div ref={(n) => { n && n.appendChild(renderedCard) }}></div>;
};

createCustomElement('snc-wds-va-adaptive-cards', {
	initialState: {
		controlClosed: false
	},
	renderer: { type: snabbdom },
	view,
	actionHandlers,
	properties: {
		controlData: {
			default: {
				cardTemplate: blankCard,
				cardData: {
					text: 'Placeholder for input-defined Adaptive Card.'
				}
			}
		},
		forceCloseControl: false,
		responseValue: {},
	},
	styles
});