export class MockUserService {
    findAll() {
    return Promise.resolve([]);
    }

    findById() {
    return Promise.resolve({});
    }

    updateById() {
    return Promise.resolve({});
    }

    delete() {
    return Promise.resolve();
    }
}