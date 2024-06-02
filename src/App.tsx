import { useEffect, useState } from 'react'
import './App.css'
import { AppBar, Box, Button, Tab, Toolbar } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { initDB } from './db/dbTool';
import { TopPage } from './display/Top';
import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState("1");

  useEffect(() => {
    initDB();
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  /*
              <Tab label="収入" value="2" />
              <Tab label="支出" value="3" />
              <Tab label="設定" value="4" />
  */

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TabContext value={value}>
        <AppBar position="static">
          <Toolbar>
            <TabList onChange={(_, value) => handleChange(value)} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
              <Tab label="Top" value="1" />
            </TabList>
          </Toolbar>
        </AppBar>
        <TabPanel value="1"><TopPage /></TabPanel>
        <TabPanel value="2"><div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <Button variant="contained" href='./practice'>Contained</Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div></TabPanel>
        <TabPanel value="3">        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
          <h1>Vite + React</h1></TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
      </TabContext>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Box>
  )
}

export default App
