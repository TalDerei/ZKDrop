export default function Form({ state, setState }) {
    return (
        <form>
            <div>
                OPEN UP DEV CONSOLE TO SEE INFO!
            </div>
            <br></br>
            <div>
                ENTER SECRET 
                <br></br>
                <input
                    type="text"
                    name="secret"
                    className="form-control"
                    value={state.secret}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div> 
            <br></br>
            <div>
                ENTER NULLIFIER
                <br></br>
                <input
                    type="text"
                    name="key"
                    className="form-control"
                    value={state.key}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div>
            <br></br>
            <div>
                AIRDROP CONTRACT ADDRESS
                <br></br>
                  <input
                    type="text"
                    name="airdropAddress"
                    className="form-control"
                    value={state.airdropAddress}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                    />
                </div>
        </form>
    );
}