import { Add, Search } from '@/lib/icons'
import { Button, ComboBox, InputField } from '@/lib/imports'
import React from 'react'

const ManageQuestion = () => {
    return (
        <div className='w-full px-4 md:px-6 lg:px-8 '>


            <div className='m-4 md:m-6 lg:m-8 gap-4 md:gap-6 lg:gap-8 flex flex-col'>
                <Button text="Add New Question" backgroundColor="bg-linear-to-r from-primary to-secondary" textColor="text-white" className="w-fit" leftIcon={<Add />} />

                <div>
                    <InputField icon={<Search />} />
                    <ComboBox
                        label="Select fruit"
                        options={['Apple', 'Banana', 'Cherry', 'Dragon fruit', 'Elderberry', 'Fig', 'Grape']}
                        placeholder="Pick one..."
                    // no onChange → just visual demo
                    />
                </div>
            </div>
        </div>
    )
}

export default ManageQuestion