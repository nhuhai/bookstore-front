import React from 'react';
import './App.css';
import InvoiceForm from './components/invoice-form';
import SubInvoiceForm from './components/sub-invoice-form';
import InvoiceHeader from './components/invoice-header';
import { Layout, Menu, Icon, Button } from 'antd';
import { CurrentInvoiceContext } from './current-invoice-context';
import InvoiceTabs from './components/invoice-tabs';

const { Sider, Content } = Layout;

export default class App extends React.Component {
  onAddNewRowToSubInvoice = (subInvoiceIndex, newRow) => {
    const { currentInvoice } = this.state;
    const newInvoice = Object.assign({}, currentInvoice);
    const { subInvoices = [] } = newInvoice;
    const subInvoiceToAddRowTo = subInvoices[subInvoiceIndex];

    if (!subInvoiceToAddRowTo) return;

    const { entries = [] } = subInvoiceToAddRowTo;
    subInvoiceToAddRowTo.entries = [...entries, newRow];

    this.setState({
      currentInvoice: newInvoice,
    });
  };

  onSaveSubInvoiceRow = (subInvoiceIndex, newData, rowIndex) => {
    const { currentInvoice } = this.state;
    const newInvoice = Object.assign({}, currentInvoice);
    const { subInvoices = [] } = newInvoice;
    const subInvoiceToSaveRowTo = subInvoices[subInvoiceIndex];

    if (!subInvoiceToSaveRowTo) return;

    const { entries = [] } = subInvoiceToSaveRowTo;
    const { name, quantity, price } = newData;

    entries[rowIndex] = {
      name,
      quantity,
      price
    };

    this.setState({
      currentInvoice: newInvoice,
    });
  }

  onDeleteSubInvoiceRow = (subInvoiceIndex, rowIndex) => {
    const { currentInvoice } = this.state;
    const newInvoice = Object.assign({}, currentInvoice);
    const { subInvoices = [] } = newInvoice;
    const subInvoiceToSaveRowTo = subInvoices[subInvoiceIndex];
    const { entries = [] } = subInvoiceToSaveRowTo;

    if (!subInvoiceToSaveRowTo) return;

    entries.splice(rowIndex, 1);

    this.setState({
      currentInvoice: newInvoice,
    });
  }

  state = {
    collapsed: false,
    invoiceFormVisible: false,
    subInvoiceFormVisible: false,
    currentInvoice: null,
    onAddNewRowToSubInvoice: this.onAddNewRowToSubInvoice,
    onSaveSubInvoiceRow: this.onSaveSubInvoiceRow,
    onDeleteSubInvoiceRow: this.onDeleteSubInvoiceRow,
  };

  onCollapse = collapsed => this.setState({ collapsed });

  saveInvoiceFormRef = formRef => this.invoiceFormRef = formRef;
  onOpenInvoiceForm = () => this.setState({ invoiceFormVisible: true });
  onCancelInvoiceForm = () => this.setState({ invoiceFormVisible: false });

  saveSubInvoiceFormRef = formRef => this.subInvoiceFormRef = formRef;
  onOpenSubInvoiceForm = () => this.setState({ subInvoiceFormVisible: true });
  onCancelSubInvoiceForm = () => this.setState({ subInvoiceFormVisible: false });

  onCreateInvoice = () => {
    const form = this.invoiceFormRef.props.form;

    form.validateFields((err, values) => {
      if (err) return;

      console.log('Received values of form: ', values);
      const { name, address, phone, createdBy } = values;
      const currentInvoice = {
        invoiceId: Math.floor(Math.random() * 10000),
        name,
        address,
        phone,
        createdBy,
        creationTime: new Date().toLocaleString(),
        lastModifiedTime: new Date().toLocaleString(),
        isSaved: false,
        status: 'New',
        subInvoices: [{
          name: 'Sach Giao Khoa',
          discountPercent: 20,
          entries: [{
            name: 'Tieng Viet 1/1',
            price: 10000,
            quantity: 5,
          }, {
            name: 'Toan 1',
            price: 15000,
            quantity: 10,
          }],
        }],
      };

      form.resetFields();
      this.setState({
        invoiceFormVisible: false,
        currentInvoice
      });
    });
  }

  onCreateSubInvoice = () => {
    const form = this.subInvoiceFormRef.props.form;

    form.validateFields((err, values) => {
      if (err) return;

      console.log('Received values of form: ', values);
      const { name, discountPercent } = values;
      const { currentInvoice } = this.state;
      const newInvoice = Object.assign({}, currentInvoice);

      newInvoice.subInvoices.push({
        name,
        discountPercent,
      });

      form.resetFields();
      this.setState({
        subInvoiceFormVisible: false,
        currentInvoice: newInvoice
      });
    });
  }

  render() {
    const { currentInvoice } = this.state;

    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <div className="logo" style={{ color: 'white' }}>NS Nhu Hai</div>
            <Button type="primary" onClick={this.onOpenInvoiceForm}>New Invoice</Button>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>New Bill</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Old Bills</span>
              </Menu.Item>
            </Menu>
          </Sider>

          {currentInvoice && (
            <CurrentInvoiceContext.Provider value={this.state}>
              <Layout>
                <InvoiceHeader />
                <Content style={{ margin: '0' }}>
                  <div style={{ padding: '0 24px', background: '#fff', minHeight: 360 }}>
                    <InvoiceTabs onNewTab={this.onOpenSubInvoiceForm} />
                  </div>
                </Content>
              </Layout>
            </CurrentInvoiceContext.Provider>
          )}
        </Layout>

        <InvoiceForm
          wrappedComponentRef={this.saveInvoiceFormRef}
          visible={this.state.invoiceFormVisible}
          onCancel={this.onCancelInvoiceForm}
          onCreate={this.onCreateInvoice}
        />

        <SubInvoiceForm
          wrappedComponentRef={this.saveSubInvoiceFormRef}
          visible={this.state.subInvoiceFormVisible}
          onCancel={this.onCancelSubInvoiceForm}
          onCreate={this.onCreateSubInvoice}
        />
      </div>
    );
  }
}
