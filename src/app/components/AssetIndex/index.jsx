import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import * as qs from 'query-string'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createStructuredSelector } from 'reselect'
import { compose, setDisplayName, withProps } from 'recompose'
import withToggle from 'Hoc/withToggle'

import AssetIndexTable from 'Components/AssetIndexTable'
import Layout from 'Components/Layout'
import Paginator from 'Components/Paginator'
import LoadingFullscreen from 'Components/LoadingFullscreen'

import { getAssetIndexPage, getNumberOfAssets, areAssetPricesLoaded, getAssetPricesError } from 'Selectors'

const AssetIndex = ({ assets, currentPage, numberOfAssets, title, pricesLoaded, pricesError }) => {
  return (
    pricesLoaded ? (
      <Fragment>
        <Helmet>
          <title>Cryptocurrency Market Capitalization Rankings - Faa.st</title>
          <meta name='description' content='An aggregated list of top cryptocurrencies sorted by market cap, volume, supply, and other data metrics.' /> 
        </Helmet>
        <Layout className='pt-3'>
          <AssetIndexTable tableHeader={title} assets={assets} />
          <Paginator page={currentPage} pages={Math.ceil(numberOfAssets / 50)}/>
        </Layout>
      </Fragment>) : (
      <LoadingFullscreen center label='Loading market data...' error={pricesError}/>   
    )
  )
}

export default compose(
  setDisplayName('AssetIndex'),
  withToggle('dropdownOpen'),
  withRouter,
  withProps(({ location }) => {
    const urlParams = qs.parse(location.search)
    let { page: currentPage = 1 } = urlParams
    currentPage = parseInt(currentPage)
    let title = currentPage > 1 ? (<span>All Assets - Page {currentPage}</span>) : 'All Assets'
    const page = currentPage - 1
    const sortField = 'marketCap'
    const limit = 50
    return ({
      currentPage,
      page,
      limit,
      sortField,
      title
    })
  }),
  connect(createStructuredSelector({
    assets: (state, { page, limit, sortField }) => getAssetIndexPage(state, { page, limit, sortField }),
    numberOfAssets: getNumberOfAssets,
    pricesLoaded: areAssetPricesLoaded,
    pricesError: getAssetPricesError
  }), {
  }),
)(AssetIndex)
