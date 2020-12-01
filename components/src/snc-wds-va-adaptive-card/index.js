import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';

import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import markdownit from "markdown-it";

import styles from './styles.scss';
import { actionHandlers } from './actionHandlers.js';

import hostConfig from './hostConfig.json';
import blankCard from '../blankCard.json';

import { CARD_SUBMITTED, URL_OPENED } from '../constants.js';

AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
	result.outputHtml = markdownit().render(text);
	result.didProcess = true;
};

var adaptiveCard = new AdaptiveCards.AdaptiveCard();

const view = (state, { dispatch }) => {

	const { properties } = state;

	if (state.controlClosed || properties.forceCloseControl) {
		return (<div></div>);
	}

	adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({...hostConfig});

	adaptiveCard.onExecuteAction = function ({_propertyBag, data}) {
		if (_propertyBag.type === 'Action.OpenUrl') {
			dispatch(URL_OPENED, _propertyBag);
		} else if (_propertyBag.type === 'Action.Submit') {
			dispatch(CARD_SUBMITTED, {
				propertyBag: _propertyBag,
				data: data
			});
		}
	};

	var template = new ACData.Template(properties.controlData.cardTemplate);
	var cardPayload = template.expand({ $root: properties.controlData.cardData });
	adaptiveCard.parse(cardPayload);
	const renderedCard = adaptiveCard.render();
	return <div className="sncWdsVaAdaptiveCards" ref={(n) => { n && n.appendChild(renderedCard) }}></div>;
};

createCustomElement('snc-wds-va-adaptive-card', {
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
		responseValue: {
			default: false
		},
	},
	styles
});