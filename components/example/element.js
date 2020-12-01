import '../src/snc-wds-va-adaptive-card';
import '@servicenow/sdk-ci';
import sampleProps from './adaptiveCards/simple.json';

const el = document.createElement('tool-ci-custom-control-tester');
el.componentTagName="snc-wds-va-adaptive-card";
el.initialExampleData=sampleProps;
document.body.appendChild(el);