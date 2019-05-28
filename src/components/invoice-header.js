import React from 'react';
import { PageHeader, Tag, Button, Statistic, Row, Col } from 'antd';
import { CurrentInvoiceContext } from '../current-invoice-context';

const Description = ({ term, children, span = 12 }) => (
  <Col span={span}>
    <div className="description">
      <div className="term">{term}</div>
      <div className="detail">{children}</div>
    </div>
  </Col>
);

const content = ({
  address,
  createdBy,
  creationTime,
  lastModifiedTime,
  phone,
}) => (
  <Row>
    <Description term="Tạo bởi">{createdBy}</Description>
    <Description term="Địa chỉ">{address}</Description>
    <Description term="Tạo lúc">{creationTime}</Description>
    <Description term="Phone">{phone}</Description>
    <Description term="Sửa lần cuối">{lastModifiedTime}</Description>
    <Description term="Ghi chú" span={24}>
      Chưa thu tiền
    </Description>
  </Row>
);

const extraContent = ({ status, total }) => (
  <Row>
    <Col span={12}>
      <Statistic title="Status" value={status} />
    </Col>
    <Col span={12}>
      <Statistic title="Total" suffix="VND" value={total} />
    </Col>
  </Row>
);

export default () => {
  return (
    <CurrentInvoiceContext.Consumer>
      {({ currentInvoice }) => {
        const { invoiceId, name } = currentInvoice;

        return (
          <PageHeader
            title={name}
            subTitle={`InvoiceId: ${invoiceId}`}
            tags={<Tag color="red">Not Paid</Tag>}
            extra={[
              <Button key="2">Print</Button>,
              <Button key="1" type="primary">Save/Edit</Button>
            ]}
          >
            <div className="wrap">
              <div className="content padding">{content(currentInvoice)}</div>
              <div className="extraContent">{extraContent(currentInvoice)}</div>
            </div>
          </PageHeader>
        );
      }}
    </CurrentInvoiceContext.Consumer>
  );
}
