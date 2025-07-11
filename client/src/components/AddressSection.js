import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import { fetchAddresses, addAddress, updateAddress, deleteAddress, clearAddressError } from '@/redux/slices/addressSlice';

const AddressSection = ({ selectedAddress, setSelectedAddress }) => {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state) => state.address);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false
    });

    // Load addresses on component mount
    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    // Clear errors when form is closed
    useEffect(() => {
        if (!showForm && error) {
            dispatch(clearAddressError());
        }
    }, [showForm, error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await dispatch(updateAddress({ id: currentAddress._id, ...currentAddress })).unwrap();
            } else {
                await dispatch(addAddress(currentAddress)).unwrap();
            }
            // Refresh the addresses list after successful operation
            await dispatch(fetchAddresses());
            resetForm();
        } catch (error) {
            console.error("Operation failed:", error);
        }
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                // If we deleted the selected address, clear selection
                if (selectedAddress?._id === id) {
                    setSelectedAddress(null);
                }
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const resetForm = () => {
        setCurrentAddress({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
            isDefault: false
        });
        setEditMode(false);
        setShowForm(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Shipping Addresses</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="text-primary flex items-center gap-1 text-sm"
                >
                    <FaPlus size={12} /> {showForm ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {showForm ? (
                <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name*</label>
                            <input
                                type="text"
                                value={currentAddress.fullName}
                                onChange={(e) => setCurrentAddress({ ...currentAddress, fullName: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number*</label>
                            <input
                                type="tel"
                                value={currentAddress.phone}
                                onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Street Address*</label>
                        <input
                            type="text"
                            value={currentAddress.street}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, street: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">City*</label>
                            <input
                                type="text"
                                value={currentAddress.city}
                                onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">State*</label>
                            <input
                                type="text"
                                value={currentAddress.state}
                                onChange={(e) => setCurrentAddress({ ...currentAddress, state: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">ZIP Code*</label>
                            <input
                                type="text"
                                value={currentAddress.zipCode}
                                onChange={(e) => setCurrentAddress({ ...currentAddress, zipCode: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="defaultAddress"
                            checked={currentAddress.isDefault}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, isDefault: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="defaultAddress" className="text-sm">Set as default address</label>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : editMode ? 'Update Address' : 'Save Address'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </form>
            ) : (
                <div className="space-y-3">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <div
                                key={address._id}
                                onClick={() => setSelectedAddress(address)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress?._id === address._id
                                        ? 'border-2 border-primary bg-primary/5'
                                        : 'hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{address.fullName}</p>
                                        <p className="text-sm text-gray-600">{address.street}</p>
                                        <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.zipCode}</p>
                                        <p className="text-sm text-gray-600">{address.country}</p>
                                        <p className="text-sm text-gray-600">{address.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedAddress?._id === address._id && (
                                            <FaCheck className="text-primary mt-1" />
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(address);
                                            }}
                                            className="text-gray-500 hover:text-primary"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(address._id);
                                            }}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                {address.isDefault && (
                                    <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded mt-2">
                                        Default
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            {loading ? 'Loading addresses...' : 'No addresses saved. Please add a new address.'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressSection;