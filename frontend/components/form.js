import Link from "next/link";

export default function Form({ state, setState }) {
    return (
        <form>
            <div class="form-class">
                {/* OPEN UP DEV CONSOLE TO SEE INFO! */}
            </div>
            <div class="form-class">
                ENTER KEY
                <br></br>
                <input
                    type="text"
                    name="key"
                    className="smaller-input"
                    value={state.key}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div>
            <br></br>
            <div class="form-class">
                ENTER SECRET 
                <br></br>
                <input
                    type="text"
                    name="secret"
                    className="smaller-input"
                    value={state.secret}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                />
            </div> 
            <br></br>
            <div class="form-class">
                ENTER AIRDROP 
                <br></br>
                CONTRACT ADDRESS
                <br></br>
                  <input
                    type="text"
                    name="airdropAddress"
                    className="smaller-input"
                    value={state.airdropAddress}
                    onChange={evt => setState({...state, [evt.target.name]: evt.target.value})}
                    />
                </div>
        </form>
    );
}