import React from 'react'

const Header: React.FC = () => {
    return (
        <div
            className='flex justify-between items-center'
            style={{padding: '20px 40px', borderBottom:'1px solid #EEEEEE' }}>
            <img src="/client-logo.svg" height={120} width={120} alt='logo' />
            <div className='flex flex-col items-end'>
                <div style={{fontSize:30, fontWeight:'bold'}}>
                    AI Assessment Round
                </div>
                <div style={{fontSize:20, color:"#BBBBBB"}}>Powered by <span style={{color:"#FF622D", fontWeight:'500'}}>Hireomatic</span></div>

            </div>
        </div>
    )
}

export default Header
