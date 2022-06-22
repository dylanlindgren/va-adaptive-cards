import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';
import hostConfig from './hostConfig.json';
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import markdownit from "markdown-it";
import {t} from '@servicenow/library-translate';

import styles from './styles.scss';
import { actionHandlers } from './actionHandlers.js';

import blankCard from '../blankCard.json';

import { CARD_SUBMITTED, URL_OPENED } from '../constants.js';

const view = (state, { dispatch }) => {

	const { properties } = state;

	if (!properties.displayClosedInputControl && properties.controlData.cardTemplateClosed && state.controlClosed && !properties.responseValue) {
		return (<div>{t('Your response has been captured. Thanks.')}</div>)
	}

	function appendAcElem (parentElem) {

		var adaptiveCard = new AdaptiveCards.AdaptiveCard();
		adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({ ...hostConfig });

		AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
			result.outputHtml = markdownit().render(text);
			result.didProcess = true;
		}

		adaptiveCard.onExecuteAction = function ({ _propertyBag, data }) {
			if (_propertyBag.type === 'Action.OpenUrl') {
				dispatch(URL_OPENED, _propertyBag);
			} else if (_propertyBag.type === 'Action.Submit') {
				if (!state.controlClosed && !properties.forceCloseControl) {
					dispatch(CARD_SUBMITTED, {
						propertyBag: _propertyBag,
						data: data
					});
				}
			}
		};

		var template = properties.controlData.cardTemplate;
		
		if (properties.controlData.cardTemplateClosed) {
			template = !state.controlClosed ? properties.controlData.cardTemplate : properties.controlData.cardTemplateClosed;
		}

		var loadedTemplate = new ACData.Template(template);

		var cardData = properties.controlData.cardData;
		cardData = cardData === undefined ? {} : cardData;

		if (properties.responseValue) {
			cardData.sncWdsVaAdaptiveCardResponse = properties.responseValue;
		}
		
		var cardPayload = loadedTemplate.expand({ $root: cardData });
		adaptiveCard.parse(cardPayload);

		parentElem.replaceChildren(adaptiveCard.render());
	}

	return (
		<div className="sncWdsVaAdaptiveCards">
			<div hook-insert={vnode => appendAcElem(vnode.elm)} hook-update={vnode => appendAcElem(vnode.elm)}></div>
		</div>
	)
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
				cardTemplateClosed: blankCard,
				displayClosedInputControl: false,
				cardData: {
					text: 'Placeholder for input-defined Adaptive Card.'
				}
			}
		},
		forceCloseControl: {
			default: false
		},
		responseValue: {
			default: false
		},
		nowAvoidRender: {
			default: false
		}
	},
	styles
});