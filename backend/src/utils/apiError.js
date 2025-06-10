class apiError extends Error{
    constructor(status,message='something went wrong',errors=[])
    {
        super(message)
        this.statusCode =status
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors
       

    }
}

export {apiError}