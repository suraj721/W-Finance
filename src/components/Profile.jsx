import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const [detailsMessage, setDetailsMessage] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    
    // Reminders State
    const [reminders, setReminders] = useState([]);
    const [rTitle, setRTitle] = useState('');
    const [rAmount, setRAmount] = useState('');
    const [rDate, setRDate] = useState('');
    const [rType, setRType] = useState('bill');
    const [isRLoading, setIsRLoading] = useState(false);
    
    const navigate = useNavigate();

    const fetchReminders = useCallback(async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
            const res = await fetch(`${apiUrl}/api/reminders`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (data.success) setReminders(data.data);
        } catch (err) {
            console.error('Fetch reminders failed:', err);
        }
    }, [user.token]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if(user.photo){
                const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
                setPreview(`${apiUrl}/${user.photo}`);
            }
            fetchReminders();
        }
    }, [user, fetchReminders]);

    const handleAddReminder = async (e) => {
        e.preventDefault();
        setIsRLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
            const res = await fetch(`${apiUrl}/api/reminders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ title: rTitle, amount: rAmount, date: rDate, type: rType, color: rType === 'bill' ? 'accent' : 'primary' })
            });
            const data = await res.json();
            if (data.success) {
                setReminders([...reminders, data.data]);
                setRTitle('');
                setRAmount('');
                setRDate('');
                // Dispatch event for Header sync
                window.dispatchEvent(new CustomEvent('remindersUpdated'));
            }
        } catch (err) {
            console.error('Add reminder failed:', err);
        } finally {
            setIsRLoading(false);
        }
    };

    const handleDeleteReminder = async (id) => {
        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
            const res = await fetch(`${apiUrl}/api/reminders/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setReminders(reminders.filter(r => r._id !== id));
                // Dispatch event for Header sync
                window.dispatchEvent(new CustomEvent('remindersUpdated'));
            }
        } catch (err) {
            console.error('Delete reminder failed:', err);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        setIsLoadingDetails(true);
        setDetailsMessage(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if(photo){
            console.log("Appending photo to FormData:", photo);
            formData.append('photo', photo);
        } else {
            console.log("No photo selected");
        }

        try {
            console.log("Sending update request...");
            const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
            const res = await fetch(`${apiUrl}/api/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.data);
                setDetailsMessage({ type: 'success', text: 'Details updated successfully' });
            } else {
                setDetailsMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (err) {
            setDetailsMessage({ type: 'error', text: 'Server error' });
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsLoadingPassword(true);
        setPasswordMessage(null);

        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
            const res = await fetch(`${apiUrl}/api/auth/updatepassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setPasswordMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: 'Server error' });
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">Profile</h2>
                   <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Security & Identity</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="h-12 px-8 rounded-full bg-white dark:bg-[#161616] border border-accent/20 text-accent text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all shadow-[0_0_20px_rgba(255,92,0,0.2)] flex items-center gap-2 mb-1"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Terminate Session
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Update Details Form */}
                <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase mb-8 tracking-tight">Personal Details</h3>
                    
                    {detailsMessage && (
                        <div className={`p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest ${
                            detailsMessage.type === 'success' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-accent/10 text-accent border border-accent/20'
                        }`}>
                            {detailsMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleDetailsUpdate} className="space-y-8">
                        <div className="flex flex-col items-center gap-6 mb-10">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 dark:border-[#1A1A1A] ring-4 ring-primary/20 shadow-2xl relative bg-slate-100 dark:bg-[#0D0D0D] group/photo">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover group-hover:photo:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest">
                                    Refresh
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field px-6 py-4 font-bold tracking-wide"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field px-6 py-4 font-bold tracking-wide"
                                    required
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoadingDetails}
                            className="btn-primary w-full h-14 text-sm uppercase tracking-[0.2em]"
                        >
                            {isLoadingDetails ? 'Processing...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Update Password Form */}
                <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[60px] pointer-events-none group-hover:bg-secondary/10 transition-all" />
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase mb-8 tracking-tight">Security Access</h3>

                    {passwordMessage && (
                        <div className={`p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest ${
                            passwordMessage.type === 'success' 
                                ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                                : 'bg-accent/10 text-accent border border-accent/20'
                        }`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Current Key</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input-field px-6 py-4 font-bold tracking-wide"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">New Key</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field px-6 py-4 font-bold tracking-wide"
                                required
                                minLength="6"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Verify New Key</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="input-field px-6 py-4 font-bold tracking-wide"
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoadingPassword}
                                className="w-full h-14 rounded-full bg-secondary text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,209,255,0.2)] disabled:opacity-50"
                            >
                                {isLoadingPassword ? 'Securing...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Reminder Management Section */}
            <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-all" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Notifications & Intelligence</h3>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage your smart alerts and reminders</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Add Reminder Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleAddReminder} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Reminder Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Gym Membership"
                                        value={rTitle}
                                        onChange={(e) => setRTitle(e.target.value)}
                                        className="input-field px-6 py-4 font-bold tracking-wide"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Amount</label>
                                    <input
                                        type="text"
                                        placeholder="₹999"
                                        value={rAmount}
                                        onChange={(e) => setRAmount(e.target.value)}
                                        className="input-field px-6 py-4 font-bold tracking-wide"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Timeline</label>
                                    <input
                                        type="text"
                                        placeholder="In 3 days"
                                        value={rDate}
                                        onChange={(e) => setRDate(e.target.value)}
                                        className="input-field px-6 py-4 font-bold tracking-wide"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                {['bill', 'rent', 'insight', 'subscription'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setRType(type)}
                                        className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                                            rType === type 
                                                ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(217,255,0,0.3)]' 
                                                : 'bg-white dark:bg-[#0D0D0D] border-slate-300 dark:border-[#222222] text-slate-500 hover:border-slate-400 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isRLoading || !rTitle || !rDate}
                                className="btn-primary w-full h-14 text-sm uppercase tracking-[0.2em] mt-4"
                            >
                                {isRLoading ? 'Adding...' : 'Add Alert'}
                            </button>
                        </form>
                    </div>

                    {/* Existing Reminders List */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                            {reminders.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-[#222222] rounded-3xl text-slate-600">
                                    <svg className="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">No Active Intelligence</span>
                                </div>
                            ) : (
                                reminders.map((rem) => (
                                    <div key={rem._id} className="group/item flex items-center justify-between p-6 bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-[#1A1A1A] rounded-3xl hover:border-primary/30 transition-all hover:bg-slate-50 dark:hover:bg-[#111111]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-10 rounded-full ${
                                                rem.color === 'primary' ? 'bg-primary shadow-[0_0_10px_rgba(217,255,0,0.4)]' : 
                                                rem.color === 'secondary' ? 'bg-secondary shadow-[0_0_10px_rgba(0,209,255,0.4)]' : 
                                                'bg-accent shadow-[0_0_10px_rgba(255,92,0,0.4)]'
                                            }`} />
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{rem.title}</h4>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{rem.date} • {rem.amount || 'No fixed amount'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteReminder(rem._id)}
                                            className="w-10 h-10 rounded-full border border-slate-300 dark:border-[#222222] flex items-center justify-center text-slate-600 hover:text-accent hover:border-accent/40 transition-all opacity-0 group-hover/item:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
