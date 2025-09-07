const { Order, Item } = require('../src/order');

describe('Item', () => {
    test('creates an item with id, name, and price', () => {
        const item = new Item(1, 'Pizza', 25.50);
        expect(item).toEqual({ id: 1, name: 'Pizza', price: 25.50 });
    });
});

describe('Order', () => {
    let item1, item2, item3;

    beforeEach(() => {
        item1 = new Item(1, 'Pizza', 25.50);
        item2 = new Item(2, 'Burger', 15.00);
        item3 = new Item(3, 'Soda', 5.00);
    });

    test('constructor handles default and custom parameters', () => {
        const order1 = new Order(1);
        expect(order1).toMatchObject({ id: 1, items: [], paymentMethod: 'cash', status: 'created', total: 0 });

        const order2 = new Order(2, [item1, item2], 'credit_card');
        expect(order2).toMatchObject({ id: 2, items: [item1, item2], paymentMethod: 'credit_card', status: 'created', total: 40.50 });
    });

    test.each([
        { items: [], expectedTotal: 0 },
        { items: [item1, item2, item3], expectedTotal: 45.50 }
    ])('calculateTotal returns correct total for %o', ({ items, expectedTotal }) => {
        const order = new Order(1, items);
        expect(order.calculateTotal()).toBe(expectedTotal);
    });

    test('addItem updates items and total', () => {
        const order = new Order(1);
        order.addItem(item1);
        order.addItem(item2);
        expect(order.items).toEqual([item1, item2]);
        expect(order.total).toBe(40.50);
    });

    test('removeItem works correctly', () => {
        const order = new Order(1, [item1, item2, item3]);
        order.removeItem(2);
        expect(order.items).toEqual([item1, item3]);
        expect(order.total).toBe(30.50);

        // Removing non-existent item
        order.removeItem(999);
        expect(order.items).toEqual([item1, item3]);
    });

    test.each([
        { initialStatus: 'created', action: 'pay', expectedStatus: 'paid' },
        { initialStatus: 'paid', action: 'complete', expectedStatus: 'completed' },
        { initialStatus: 'created', action: 'cancel', expectedStatus: 'cancelled' }
    ])('$action updates status from $initialStatus to $expectedStatus', ({ initialStatus, action, expectedStatus }) => {
        const order = new Order(1);
        order.status = initialStatus;
        if ((action === 'pay' && ['paid','completed','cancelled'].includes(initialStatus)) ||
            (action === 'complete' && initialStatus !== 'paid') ||
            (action === 'cancel' && initialStatus === 'completed')) {
            expect(() => order[action]()).toThrow();
        } else {
            order[action]();
            expect(order.status).toBe(expectedStatus);
        }
    });
});
