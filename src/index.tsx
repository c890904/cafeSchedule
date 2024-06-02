import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ColorTabs} from "./practice/App"
export const AppRouter = () => {
  <>
<BrowserRouter>
<Routes>
  <Route path="/practice" element={<ColorTabs/>}/>
</Routes>
</BrowserRouter>
</>
}
