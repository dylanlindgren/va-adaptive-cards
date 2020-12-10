import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';

import styles from './styles.scss';
import { actionHandlers } from './actionHandlers.js';

import hostConfig from './hostConfig.json';
import blankCard from '../blankCard.json';

import { CARD_SUBMITTED, URL_OPENED } from '../constants.js';

const view = (state, { dispatch }) => {

	const { properties } = state;

	if (state.controlClosed || properties.forceCloseControl) {
		return (<div></div>);
	}

	let loaded = 0;

	let acRef = null;

	function areAllLoaded() {
		loaded++;

		if (loaded === 3) {
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
					dispatch(CARD_SUBMITTED, {
						propertyBag: _propertyBag,
						data: data
					});
				}
			};
	
			var template = new ACData.Template(properties.controlData.cardTemplate);
			var cardPayload = template.expand({ $root: properties.controlData.cardData });
			adaptiveCard.parse(cardPayload);
			acRef.appendChild(adaptiveCard.render());
		}
	}

	const cardScriptEl = document.createElement("script");
	cardScriptEl.onload = areAllLoaded;
	cardScriptEl.src = "https://unpkg.com/adaptivecards/dist/adaptivecards.js";

	const templateScriptEl = document.createElement("script");
	templateScriptEl.onload = areAllLoaded;
	templateScriptEl.src = "https://unpkg.com/adaptivecards-templating/dist/adaptivecards-templating.min.js";

	const markdownItEl = document.createElement("script");
	markdownItEl.onload = areAllLoaded;
	markdownItEl.src = "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.3/markdown-it.min.js";

	return (
		<div ref={(n) => { n && n.appendChild(cardScriptEl) && n.appendChild(templateScriptEl) && n.appendChild(markdownItEl) }}>
			<div className="sncWdsVaAdaptiveCards" ref={element => acRef = element}></div>
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