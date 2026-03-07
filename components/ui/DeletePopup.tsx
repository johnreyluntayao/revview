import { Button } from '@/lib/client-imports'
import React from 'react'
import { ToDelete } from '../samples/Icons'

const DeletePopup = () => {
    return (
        <div className="bg-background rounded-lg border p-4 md:p-6 lg:p-8 max-w-95 max-h-60 self-center">

            <div className="flex items-center gap-3 mb-4">
                <ToDelete className="lg:h-8 lg:w-8 md:h-6 md:w-6 h-6 w-6 text-destructive shrink-0" />
                <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
                    Delete Question?
                </h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className='grid grid-cols-2 gap-2 md:gap-4 lg:gap-6 w-full'>
                <Button text="Cancel" />
                <Button text="Delete" borderColor='border-destructive' backgroundColor='bg-destructive' textColor='text-white' />
            </div>
        </div>
    )
}

export default DeletePopup