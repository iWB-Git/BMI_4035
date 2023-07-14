import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message, Menu } from 'antd';
import { calculateBMI } from './utils';

const { SubMenu } = Menu;

const App = () => {
  const [form] = Form.useForm();
  const [bmiData, setBmiData] = useState([]);
  const [activePage, setActivePage] = useState('home');
  const [calculatedBMI, setCalculatedBMI] = useState(null);
  
  const calculateAverageBMI = () => {
    if (bmiData.length === 0) {
      return 0;
    }
  
    const sumBMI = bmiData.reduce((sum, data) => {
      // Ensure the BMI value is a valid number
      const bmi = parseFloat(data.bmi);
      return isNaN(bmi) ? sum : sum + bmi;
    }, 0);
  
    const averageBMI = sumBMI / bmiData.length;
  
    // Check if the averageBMI is NaN or Infinity
    if (isNaN(averageBMI) || !isFinite(averageBMI)) {
      return 0;
    }
  
    // Round the averageBMI to two decimal places
    return averageBMI.toFixed(2);
  };

  const handleCalculate = () => {
    form.validateFields().then((values) => {
      const { height, weight } = values;
      const bmi = calculateBMI(height, weight);
      setCalculatedBMI(bmi);
      form.resetFields();

      const newData = {
        height,
        weight,
        bmi
      };
      
      fetch('http://localhost:3001/api/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
      .then(response => response.json())
      .then(data => {
        message.success(data.message);

      })
      .catch(error => {
        console.error(error);
        message.error(error.message);
      });
    });
  };


  const fetchBMIResults = () => {
    fetch('http://localhost:3001/api/bmi')
      .then(response => response.json())
      .then(data => setBmiData(data))
      .catch(error => {
        console.error(error);
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (activePage === 'results') {
      fetchBMIResults();
    }
  }, [activePage]);

  const columns = [
    { title: 'Height', dataIndex: 'height', key: 'height' },
    { title: 'Weight', dataIndex: 'weight', key: 'weight' },
    { title: 'BMI', dataIndex: 'bmi', key: 'bmi' }
  ];

  const handleMenuClick = ({ key }) => {
    setActivePage(key);
  };

  const renderPageContent = () => {
    if (activePage === 'home') {
      return (
        <div>
          {calculatedBMI !== null && (
        <div>
          <h2>Your BMI: {calculatedBMI}</h2>
        </div>
      )}
          <Form form={form} layout="inline">
            <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Please enter your height.' }]}>
              <Input placeholder="Height" />
            </Form.Item>
            <Form.Item label="Weight" name="weight" rules={[{ required: true, message: 'Please enter your weight.' }]}>
              <Input placeholder="Weight" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleCalculate}>Calculate BMI</Button>
            </Form.Item>
          </Form>
        </div>
      );
    } else if (activePage === 'results') {
      return (
        <div>
          <Table dataSource={bmiData} columns={columns} />
          <div>
            <h2>Average BMI: {calculateAverageBMI()}</h2>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Menu onClick={handleMenuClick} selectedKeys={[activePage]} mode="horizontal">
        <Menu.Item key="home">Home</Menu.Item>
        <Menu.Item key="results">Results</Menu.Item>
      </Menu>
      <div style={{ padding: '20px' }}>
        {renderPageContent()}
      </div>
    </div>
  );
};

export default App;
