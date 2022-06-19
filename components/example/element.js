import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import flight from './adaptiveCards/flight.json'
import form from './adaptiveCards/form.json'
import simple from './adaptiveCards/simple.json'
import task from './adaptiveCards/task.json'

import '../src/index.js';

const view = (state, { updateState }) => {
    return (
        <div>
            <snc-wds-va-adaptive-card control-data={flight} />
            <snc-wds-va-adaptive-card control-data={form} />
            <snc-wds-va-adaptive-card control-data={simple} />
            <snc-wds-va-adaptive-card control-data={task} />
        </div>
    );
};

createCustomElement('snc-wds-va-adaptive-card-examples', {
    initialState: {},
    renderer: { type: snabbdom },
    view
});

const el = document.createElement('main');
document.body.appendChild(el);

el.innerHTML = '<snc-wds-va-adaptive-card-examples/>';