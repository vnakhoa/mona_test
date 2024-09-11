import { Modal, Table } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeAllCart } from "../slides/cartSlice"

export default function ConfirmOrder({ isModalOpen, setIsModalOpen, customerInfo, cart, paymentMethod, customerCash, total, }) {
  const dispatch = useDispatch();

  return (
    <Modal
      title="Confirm Order"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => {
        setIsModalOpen(false);
        dispatch(removeAllCart());
      }}
    >
      {
        cart.length > 0 ?
          <>
            <p className='font-bold'>Name: {customerInfo.name}</p>
            <p className='font-bold'>Email: {customerInfo.email}</p>
            <p className='font-bold'>Phone: {customerInfo.phone}</p>

            <h3 className='font-bold underline mb-2 mt-2'>Order Summary:</h3>
            <Table
              dataSource={cart}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  render: (text) => <span>{text}</span>,
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (text) => <span>${text}</span>,
                },
                {
                  title: 'Total',
                  key: 'total',
                  render: (record) => <span>${record.quantity * record.price}</span>,
                },
              ]}
              pagination={false}
              bordered
              size="small"
            />
            <p className='font-bold mt-2'>Total: ${total}</p>
            {paymentMethod === 'cash' && customerCash > total && (
              <p>Change to return to the customer: ${customerCash - total}</p>
            )}
          </>
          :
          "Cart is empty. Please select products to continue process !"
      }
    </Modal>
  );
};
