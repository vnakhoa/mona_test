import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Select, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mockProducts } from '../mock-data/mockData';
import { addProductToCart, removeProductFromCart, updateProductPrice, updateProductQuantity } from '../slides/cartSlice';
import ConfirmOrder from './ConfirmOrder';

export default function CreateOrder() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const total = useSelector((state) => state.cart.total);

  const [form] = Form.useForm();
  const [order, setOrder] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    cart: [],
    paymentMethod: 'cash',
    customerCash: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [animationState, setAnimationState] = useState({});

  const handleFormChange = (changedValues) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customer: {
        ...prevOrder.customer,
        ...changedValues,
      },
    }));
  };

  const handleProductSelect = (productId) => {
    const product = mockProducts.find((item) => item.id === productId);
    dispatch(addProductToCart(product));
    setSelectedProduct(null);
    setAnimationState((prev) => ({
      ...prev,
      [product.id]: 'fadeIn',
    }));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      handleRemoveProduct(productId);
      return;
    }
    dispatch(updateProductQuantity({ id: productId, quantity }));
  };

  const handleRemoveProduct = (productId) => {
    setAnimationState((prev) => ({
      ...prev,
      [productId]: 'scaleOut',
    }));

    setTimeout(() => {
      dispatch(removeProductFromCart(productId));
    }, 500);
  };

  const handlePriceChange = (productId, price) => {
    if (price < 0) return;
    dispatch(updateProductPrice({ id: productId, price }));
  };

  const handlePaymentMethodChange = (e) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      paymentMethod: e.target.value,
    }));
  };

  const handleCustomerCashChange = (value) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customerCash: value,
    }));
  };

  const handleConfirmOrder = () => {
    form
      .validateFields()
      .then(() => {
        setOrder((prevOrder) => ({
          ...prevOrder,
          cart,
        }));
        setIsModalOpen(true);
      })
      .catch(() => {
        message.error('Please fill in all required fields!');
      });
  };

  const columnsCart = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handlePriceChange(record.id, Number(e.target.value))}
          style={{ width: '100px' }}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleQuantityChange(record.id, Number(e.target.value))}
          style={{ width: '80px' }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined className='hover:text-red-700 text-black' />}
          onClick={() => handleRemoveProduct(record.id)}
        />
      ),
    },
  ];

  useEffect(() => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      cart: cart,
    }));
  }, [cart]);

  return (
    <div className="create-order-container">
      <h2 className='text-2xl font-semibold text-purple-700'>Create Order</h2>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          email: '',
          phone: '',
        }}
        className="mb-4 bg-purple-50 p-4 rounded-lg shadow-md"
        onValuesChange={handleFormChange}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
          className='font-medium'
        >
          <Input placeholder="Name" className='font-normal' />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          className='font-medium'
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" className='font-normal' />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone number"
          className='font-medium'
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input placeholder="Phone number" className='font-normal' />
        </Form.Item>

        <Form.Item
          name="product"
          label="Select Products"
          className='font-medium'
        >
          <Select placeholder="Select Products" value={selectedProduct} onChange={handleProductSelect} style={{ width: '100%' }}>
            {mockProducts.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div className="cart-section max-h-[50vh] overflow-y-scroll shadow-md">
        <h3 className="cart-title underline px-5 py-1 rounded-md w-fit">Cart <ShoppingCartOutlined /></h3>
        <div>
          {cart.length > 0 ? (
            <Table
              dataSource={cart}
              columns={columnsCart}
              rowKey="id"
              pagination={false}
              bordered
              size="small"
              rowClassName={(record) => `transition-transform ${animationState[record.id] === 'fadeIn' ? 'animate-fadeIn' : 'animate-scaleOut'}`}
            />
          ) : <p className='text-sm px-5 text-purple-700 animate-fadeIn'>No products in the cart now!</p>}
        </div>
      </div>

      <Card className="summary bg-blue-50 p-4 rounded-lg shadow-md" title="Order Summary">
        <p className='font-bold'>Total: ${total}</p>
        {order.paymentMethod === 'cash' && (
          <div>
            <Input
              type="number"
              placeholder="Customer Cash"
              value={order.customerCash}
              onChange={(e) => handleCustomerCashChange(Number(e.target.value))}
            />
            {order.customerCash > total && <p className='text-yellow-600'>Change to return to the customer: ${order.customerCash - total}</p>}
          </div>
        )}
        <div className="payment-method flex items-center gap-6 mt-5">
          <p className="font-medium">Payment by:</p>
          <Radio.Group onChange={handlePaymentMethodChange} value={order.paymentMethod}>
            <Radio value="cash">Cash</Radio>
            <Radio value="card">Card</Radio>
          </Radio.Group>
        </div>
      </Card>

      <div className="action-buttons">
        <Button type="primary" onClick={handleConfirmOrder}>
          Confirm Order
        </Button>
      </div>

      <ConfirmOrder
        cart={order.cart}
        customerCash={order.customerCash}
        customerInfo={order.customer}
        isModalOpen={isModalOpen}
        paymentMethod={order.paymentMethod}
        total={total}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
