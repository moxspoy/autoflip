import * as ClickupService from '../src/services/clickup.js';
import * as MessageUtil from '../src/utils/message-utils.js';

const validClickUpUrl = 'https://app.clickup.com/t/9nzg9w';

test('ensure the task id from url', () => {
    const id = ClickupService.getTaskIdFromUrl(validClickUpUrl);
    const expectedTaskId = '9nzg9w';
    expect(id).toBe(expectedTaskId);
});

test('ensure the task name from url', async () => {
    const formattedTask = await MessageUtil.buildSingleTask(validClickUpUrl);
    const expectedFormat = `<https://app.clickup.com/t/9nzg9w|[Mobile] Redesign Bundle Transfer>`;
    expect(formattedTask).toBe(expectedFormat);
});


