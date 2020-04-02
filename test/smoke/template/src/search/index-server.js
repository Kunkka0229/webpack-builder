const React = require('react')
const logo = require('./images/a.jpg').default
require('./search.less')
require('../../common/index')

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
            111
            <img src={logo} onClick={this.loadComponent.bind(this)} alt="" />
            {Test && <Test />}
        </div>
    }
}

module.exports = <Search />