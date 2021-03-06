import React from 'react'
import {
  Row, Col,
} from 'reactstrap'

import Layout from 'Components/Layout'
import BlockstackWelcome from 'Components/BlockstackWelcome'
import Balances from 'Components/Balances'
import Sidebar from 'Components/Sidebar'

const DashboardView = (props) => {
  const {
    wallet, viewOnly, toggleChart, openCharts, handleRemove, isDefaultPortfolioEmpty,
  } = props

  return (
    <Layout className='pt-3'>
      {!viewOnly &&
        <BlockstackWelcome />
      }
      <Row className='gutter-3'>
        {!isDefaultPortfolioEmpty && (
          <Col xs='12' md='5' lg='4' xl='3'>
            <Sidebar/>
          </Col>
        )}
        <Col xs='12' md='7' lg='8' xl='9'>
          <Row className='gutter-3'>
            <Col xs='12'>
              <Balances 
                wallet={wallet} 
                toggleChart={toggleChart} 
                openCharts={openCharts}
                handleRemove={handleRemove}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}

export default DashboardView
