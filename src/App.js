import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useCallback } from 'react';
import TextArea from 'devextreme-react/text-area';
//import { EditorStyle, LabelMode } from 'devextreme-react/common';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  MasterDetail 
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.material.teal.dark.compact.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


const pageSizes = [10, 25, 50, 100];
// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const columns = ['hash', 'blockNumber', 'from', 'to', 'nonce', 'chainId'];
function App() {

  const [blockNumber, setBlockNumber] = useState();
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [transactionSelected, setTransactionSelected] = useState('');

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  },[]);

  useEffect(() => {
    async function setTransactions() {
      try {
        const { transactions } = await alchemy.core.getBlockWithTransactions(blockNumber)
      
        setBlockTransactions(transactions);
      } catch (error) {
        setBlockTransactions([]);
      }
    }
    setTransactions();
  },[blockNumber]);



  const onContentReady = (e) => {
    if (!e.component.getSelectedRowKeys().length) {
      e.component.selectRowsByIndexes([0]);
    }
  };

  const onSelectionChanged = useCallback(({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    //console.log("Data");
    console.log(data);
    //const singleTransaction = Array.from(data);
    if (typeof data != "undefined"){
      //console.log(Object.getOwnPropertyNames(singleTransaction));
      console.log("hash = ", data.hash);

      setTransactionSelected(data)
    }
  }, {});



  const Block = () => {
    return (
      <>
        <div style={{
            display:"flex", 
            justifyContent:"center", 
            marginTop: 24, 
            fontSize: 24,
          }}>
          <b>Block Explorer</b>
        </div>
        <div style={{display:"flex", justifyContent: "center", marginTop: 24}}>
          <p>{`Block Number: ${blockNumber} `}</p>
        </div>
      </>
    );
  }

  const Transactions = () => {
    return (
      <DataGrid
      dataSource={blockTransactions}
      defaultColumns={columns}
      showBorders={true}
      //keyExpr='hash'
      width="100%"
      //onContentReady={onContentReady}
      hoverStateEnabled={true}
      onSelectionChanged={onSelectionChanged}
    >
    <GroupPanel visible={true} />
    <Selection mode="single" />
    <SearchPanel
      visible={true}
      highlightCaseSensitive={true}
    />
    <Grouping autoExpandAll={false} />
    <Pager
        allowedPageSizes={pageSizes}
        showPageSizeSelector={true}
      />
      <Paging defaultPageSize={10} />
     { <MasterDetail
        enabled={true}
        component={JsonDetailTransaction}
      />}
    </DataGrid>
    );
  }

  const JsonDetailTransaction = () => {
    return (
      <TextArea
        height={180}
        label="Transaction Details"
        labelMode="outside"
        stylingMode='outlined'
        value={JSON.stringify(transactionSelected, undefined, 4)}
    />
  );
  }


  return (
    <>
      <Block />
      <Transactions />
    </>
  );

}

export default App;