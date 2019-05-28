import React from 'react';
import './App.css';
import { Table } from 'antd';
import Autocomplete from 'react-autocomplete';

const columns = [
  {
    title: 'Mã hàng',
    dataIndex: 'Mã hàng',
    key: 'Mã hàng',
  },
  {
    title: 'Tên mặt hàng',
    dataIndex: 'Tên mặt hàng',
    key: 'Tên mặt hàng',
  },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      dataSource: []
    };
  }

  componentWillMount() {
    fetch('/csvjson.json')
      .then((res) => res.json())
      .then((dataSource) => {
        console.log('dataSource:', dataSource);

        this.setState({ dataSource });
      });
  }

  render() {
    const { dataSource, value } = this.state;

    return (
      <div className="App">
        <Autocomplete
          shouldItemRender={(item, value) => (item["Tên mặt hàng"]).toLowerCase().indexOf(value.toLowerCase()) > -1 }
          getItemValue={(item) => item["Tên mặt hàng"]}
          items={dataSource}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }} key={item["Mã hàng"]}>
              {item["Tên mặt hàng"]}
            </div>
          }
          value={value}
          onChange={(e) => { 
            const value = e.target.value; 
            this.setState({ value }); 
          }}
        />
      
        {/* <Table dataSource={dataSource} columns={columns} />; */}
      </div>
    );
  }
}
