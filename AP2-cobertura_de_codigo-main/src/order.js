// order.js

// Simula um pedido de um cliente
class Order {
  constructor(id, items = [], paymentMethod = "cash") {
    this.id = id;
    this.items = items;
    this.paymentMethod = paymentMethod;
    this.status = "created"; // created, paid, completed, cancelled
    this.total = this.calculateTotal();
  }

  // Calcula o valor total do pedido
  calculateTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  // Adiciona um item ao pedido
  addItem(item) {
    this.items.push(item);
    this.total = this.calculateTotal();
  }

  // Remove um item do pedido
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.total = this.calculateTotal();
  }

  // Marca o pedido como pago
  pay() {
    if (this.status !== "created") {
      throw new Error("Order cannot be paid");
    }
    this.status = "paid";
  }

  // Marca o pedido como completado
  complete() {
    if (this.status !== "paid") {
      throw new Error("Order must be paid before it can be completed");
    }
    this.status = "completed";
  }

  // Cancela o pedido
  cancel() {
    if (this.status === "completed") {
      throw new Error("Completed order cannot be cancelled");
    }
    this.status = "cancelled";
  }
}

// Item para os pedidos
class Item {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

module.exports = { Order, Item };
