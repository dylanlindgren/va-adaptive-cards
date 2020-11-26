import '../src/snc-wds-va-adaptive-cards';
import * as simple from './adaptiveCards/simple.json';
import * as flight from './adaptiveCards/flight.json';
import * as form from './adaptiveCards/form.json';
import * as task from './adaptiveCards/task.json';

const el1 = document.createElement('snc-wds-va-adaptive-cards');
el1.controlData = {cardTemplate: simple};
createExample('Input', el1);

const el2 = document.createElement('snc-wds-va-adaptive-cards');
el2.controlData = {cardTemplate: flight};
createExample('Form', el2);

const el3 = document.createElement('snc-wds-va-adaptive-cards');
el3.controlData = {cardTemplate: form};
createExample('Airplane', el3);

const el4 = document.createElement('snc-wds-va-adaptive-cards');
el4.controlData = {cardTemplate: task};
createExample('Airplane', el4);

createExample('Default', document.createElement('snc-wds-va-adaptive-cards'));


function createExample(name, example) {
    const el = document.createElement('DIV');
    document.body.appendChild(el);
    el.innerHTML = '<h1>' + name + '</h1>';
    el.appendChild(example);
}