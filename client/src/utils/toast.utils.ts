import { toast } from "react-toastify";

export function handleResponse(data: any, action: () => void, noToastOnSuccess?: boolean) {
    try {
        switch (data.status) {
            case "success":
                if (!noToastOnSuccess)
                    toast.success(data.message);
                action();
                break;
            case "fail":
                toast.warn(data.message);
                break;
            case "error":
                toast.error(data.message);
                break;
            default:
                toast.error('Unknown error while picking item');
        } 
    } catch(error) {
        toast.error('Unknown error while picking item');
    }
}