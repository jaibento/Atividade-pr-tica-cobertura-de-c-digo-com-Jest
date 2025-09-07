const { Order, Item } = require('../src/order');

describe('Item', () => {
    test('should create an item with id, name, and price', () => {
        const item = new Item(1, 'Pizza', 25.50);
        
        expect(item.id).toBe(1);
        expect(item.name).toBe('Pizza');
        expect(item.price).toBe(25.50);
    });
});

describe('Order', () => {
    let item1, item2, item3;

    beforeEach(() => {
        item1 = new Item(1, 'Pizza', 25.50);
        item2 = new Item(2, 'Burger', 15.00);
        item3 = new Item(3, 'Soda', 5.00);
    });

    describe('Constructor', () => {
        test('should create an order with default parameters', () => {
            const order = new Order(1);
            
            expect(order.id).toBe(1);
            expect(order.items).toEqual([]);
            expect(order.paymentMethod).toBe('cash');
            expect(order.status).toBe('created');
            expect(order.total).toBe(0);
        });

        test('should create an order with items', () => {
            const items = [item1, item2];
            const order = new Order(1, items);
            
            expect(order.id).toBe(1);
            expect(order.items).toEqual(items);
            expect(order.paymentMethod).toBe('cash');
            expect(order.status).toBe('created');
            expect(order.total).toBe(40.50);
        });

        test('should create an order with custom payment method', () => {
            const order = new Order(1, [], 'credit_card');
            
            expect(order.id).toBe(1);
            expect(order.items).toEqual([]);
            expect(order.paymentMethod).toBe('credit_card');
            expect(order.status).toBe('created');
            expect(order.total).toBe(0);
        });

        test('should create an order with items and custom payment method', () => {
            const items = [item1];
            const order = new Order(1, items, 'debit_card');
            
            expect(order.id).toBe(1);
            expect(order.items).toEqual(items);
            expect(order.paymentMethod).toBe('debit_card');
            expect(order.status).toBe('created');
            expect(order.total).toBe(25.50);
        });
    });

    describe('calculateTotal', () => {
        test('should return 0 for empty items array', () => {
            const order = new Order(1);
            
            expect(order.calculateTotal()).toBe(0);
        });

        test('should calculate total correctly for items with prices', () => {
            const items = [item1, item2, item3];
            const order = new Order(1, items);
            
            expect(order.calculateTotal()).toBe(45.50);
        });
    });

    describe('addItem', () => {
        test('should add item to order and recalculate total', () => {
            const order = new Order(1);
            
            order.addItem(item1);
            
            expect(order.items).toContain(item1);
            expect(order.total).toBe(25.50);
        });

        test('should add multiple items and recalculate total', () => {
            const order = new Order(1);
            
            order.addItem(item1);
            order.addItem(item2);
            
            expect(order.items).toEqual([item1, item2]);
            expect(order.total).toBe(40.50);
        });
    });

    describe('removeItem', () => {
        test('should remove existing item and recalculate total', () => {
            const items = [item1, item2, item3];
            const order = new Order(1, items);
            
            order.removeItem(2); // Remove burger
            
            expect(order.items).toEqual([item1, item3]);
            expect(order.total).toBe(30.50);
        });

        test('should not affect order when removing non-existing item', () => {
            const items = [item1, item2];
            const order = new Order(1, items);
            
            order.removeItem(999); // Non-existing item
            
            expect(order.items).toEqual([item1, item2]);
            expect(order.total).toBe(40.50);
        });

        test('should handle removing item from empty order', () => {
            const order = new Order(1);
            
            order.removeItem(1);
            
            expect(order.items).toEqual([]);
            expect(order.total).toBe(0);
        });
    });

    describe('pay', () => {
        test('should mark order as paid when status is created', () => {
            const order = new Order(1);
            
            order.pay();
            
            expect(order.status).toBe('paid');
        });

        test('should throw error when trying to pay already paid order', () => {
            const order = new Order(1);
            order.status = 'paid';
            
            expect(() => order.pay()).toThrow('Order cannot be paid');
        });

        test('should throw error when trying to pay completed order', () => {
            const order = new Order(1);
            order.status = 'completed';
            
            expect(() => order.pay()).toThrow('Order cannot be paid');
        });

        test('should throw error when trying to pay cancelled order', () => {
            const order = new Order(1);
            order.status = 'cancelled';
            
            expect(() => order.pay()).toThrow('Order cannot be paid');
        });
    });

    describe('complete', () => {
        test('should mark order as completed when status is paid', () => {
            const order = new Order(1);
            order.status = 'paid';
            
            order.complete();
            
            expect(order.status).toBe('completed');
        });

        test('should throw error when trying to complete created order', () => {
            const order = new Order(1);
            
            expect(() => order.complete()).toThrow('Order must be paid before it can be completed');
        });

        test('should throw error when trying to complete already completed order', () => {
            const order = new Order(1);
            order.status = 'completed';
            
            expect(() => order.complete()).toThrow('Order must be paid before it can be completed');
        });

        test('should throw error when trying to complete cancelled order', () => {
            const order = new Order(1);
            order.status = 'cancelled';
            
            expect(() => order.complete()).toThrow('Order must be paid before it can be completed');
        });
    });

    describe('cancel', () => {
        test('should cancel order when status is created', () => {
            const order = new Order(1);
            
            order.cancel();
            
            expect(order.status).toBe('cancelled');
        });

        test('should cancel order when status is paid', () => {
            const order = new Order(1);
            order.status = 'paid';
            
            order.cancel();
            
            expect(order.status).toBe('cancelled');
        });

        test('should throw error when trying to cancel completed order', () => {
            const order = new Order(1);
            order.status = 'completed';
            
            expect(() => order.cancel()).toThrow('Completed order cannot be cancelled');
        });

        test('should cancel already cancelled order', () => {
            const order = new Order(1);
            order.status = 'cancelled';
            
            order.cancel();
            
            expect(order.status).toBe('cancelled');
        });
    });
});
