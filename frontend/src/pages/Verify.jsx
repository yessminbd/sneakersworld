import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useLang } from '../context/LangContext';
import { toast } from 'react-toastify';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function Verify() {
  const { token, backendUrl, setCartItems } = useContext(ShopContext);
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      if (!orderId) {
        navigate('/orders');
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/api/order/verifyStripe`, {
          method: 'POST',
          headers: { token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success, orderId }),
        });
        const data = await res.json();

        if (data.success) {
          if (success === 'true') {
            setCartItems({});
            setStatus('success');
            toast.success(t.paymentSuccess || "Paiement réussi ! Votre commande est confirmée.");
            setTimeout(() => navigate('/orders'), 2000);
          } else {
            setStatus('failed');
            toast.error(t.paymentCancelled || "Paiement annulé.");
            setTimeout(() => navigate('/cart'), 2000);
          }
        } else {
          setStatus('failed');
          toast.error(data.message || t.paymentError || "Erreur de vérification du paiement.");
          setTimeout(() => navigate('/orders'), 2500);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('failed');
        toast.error("Erreur de communication avec le serveur.");
        setTimeout(() => navigate('/orders'), 2500);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [token, orderId, success, backendUrl, navigate, setCartItems, t]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-primaryLight">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-md w-full text-center shadow-xl">
        {verifying ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-tertiary animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-primary">Vérification de la commande...</h2>
            <p className="text-sm text-gray-500">Veuillez patienter pendant la validation de votre paiement.</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-primary">Commande Confirmée !</h2>
            <p className="text-sm text-gray-500">Merci pour votre achat. Redirection vers vos commandes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-black text-primary">Échec ou Annulation</h2>
            <p className="text-sm text-gray-500">Le paiement n'a pas pu être validé. Redirection...</p>
          </div>
        )}
      </div>
    </div>
  );
}
