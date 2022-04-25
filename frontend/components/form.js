export default function Form({ state, setState }) {
    return (
        <form>
            <div>
                ENTER SECRET 
                <input
                    type="text"
                    name="secret"
                    className="form-control"
                    value={state.secret}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div> 
            <div>
                ENTER NULLIFIER
                <input
                    type="text"
                    name="key"
                    className="form-control"
                    value={state.key}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div>
            <div>
                AIRDROP ADDRESS
                <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={state.address}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div>
        </form>
    );
}