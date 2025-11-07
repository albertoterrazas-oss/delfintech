import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'

const InputComp = ({ placeholder = '', type= 'text', icon = null }) => {
    return (
        <div>
            <InputGroup>
                <InputGroupInput type={type} placeholder={placeholder} />
                <InputGroupAddon>
                    {icon}
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

export default InputComp