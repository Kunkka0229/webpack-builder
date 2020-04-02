import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/a.jpg'
import '../../common/index'
import { a } from './tree-shaking'

class Search extends React.Component {

    constructor() {
        super()
        this.state = {
            Test: ''
        }
    }

    loadComponent() {
        import('./test.js')
            .then(Test => {
                this.setState({
                    Test: Test.default
                })
            })
    }

    render() {
        const { Test } = this.state
        return <div className="search-text">
            <img src={logo} onClick={this.loadComponent.bind(this)} alt="" />
            {Test && <Test />}
        </div>
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
)