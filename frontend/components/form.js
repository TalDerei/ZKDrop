export default function Form({ state, setState }) {
    const handleChangeNullifier = (e)=>{
        const value = e.target.value;
        setState({
         ...state,
         [e.target.name]: value
        });
    }
    const handleChangeSecret = (e)=>{
        const value = e.target.value;
        setState({
         ...state,
         [e.target.name]: value
        });
    }
     
    return (
        <form>
            <label>
            Nullifier
            <input type="text" name="nullifier" value={state.nullifier}
                onChange={handleChangeNullifier}
            />
            </label>
            <div>
            <br></br>
            </div>
            <label>
            Secret
            <input type="text" name="secret" value={state.secret}
                onChange={handleChangeSecret}
            />
            </label>
        </form>
    );
}