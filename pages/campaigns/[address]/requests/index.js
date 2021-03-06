import React, { useState, useEffect } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';

import Campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/RequestRow';

const { Header, Row, HeaderCell, Body } = Table;

const Requests = ({ requests, address, approversCount, requestCount }) => {
  const renderRows = () =>
    requests.map((request, idx) => {
      return (
        <RequestRow
          request={request}
          key={idx}
          id={idx}
          address={address}
          approversCount={approversCount}
        />
      );
    });

  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button style={{ marginBottom: 10 }} floated="right" primary>
          New Request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>

      <div>Found {requestCount} requests</div>
    </>
  );
};

export default Requests;

export async function getServerSideProps({ params }) {
  const { address } = params;

  const campaign = Campaign(address);

  const approversCount = await campaign.methods.approversCount().call();
  const requestCount = await campaign.methods.getRequestsCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((el, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  const sanitizedRequests = requests.map(
    ({ description, value, recipient, complete, approvalCount }) => {
      return { description, value, recipient, complete, approvalCount };
    }
  );

  return {
    props: {
      address: params.address,
      requests: sanitizedRequests || [],
      approversCount,
      requestCount: sanitizedRequests.length || 0,
    },
  };
}
