// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
