import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [kiwifyLink, setKiwifyLink] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setKiwifyLink("");
    setCoverUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (book: any) => {
    setEditingId(book.id);
    setTitle(book.title);
    setDescription(book.description || "");
    setPrice(book.price.toString());
    setKiwifyLink(book.kiwifyLink);
    setCoverUrl(book.coverUrl || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este e-book?")) {
      await deleteDoc(doc(db, "books", id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!title || isNaN(parsedPrice) || !kiwifyLink) return;

    try {
      const bookData = {
        title,
        description,
        price: parsedPrice,
        kiwifyLink,
        coverUrl,
      };

      if (editingId) {
        // Needs proper update handling keeping createdAt or fetching existing doc.
        // Or using setDoc with merge to avoid touching createdAt, wait, setDoc with merge might trigger rules on createdat?
        // Let's use setDoc without touching createdAt (actually we should use updateDoc, but for simplicity setDoc with a fake createdAt might fail rules).
        // Let's just use updateDoc. Wait, my rules check if `existing().createdAt == incoming().createdAt`.
        // I'll import updateDoc.
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "books", editingId), bookData);
      } else {
        const newRef = doc(collection(db, "books"));
        await setDoc(newRef, {
          ...bookData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Erro ao salvar. Verifique se você é administrador.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">E-books</h1>
        <button onClick={openNewModal} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Novo E-book
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando e-books...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4">Capa</th>
                <th className="p-4">Título</th>
                <th className="p-4">Preço</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {book.coverUrl ? (
                        <div className="w-12 h-16 rounded overflow-hidden shadow-sm">
                           <img src={book.coverUrl} alt="Capa" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Sem Capa</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{book.title}</td>
                  <td className="p-4 text-gray-600">R$ {book.price.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(book)} className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhum e-book cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Editar E-book" : "Novo E-book"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Livro</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Venda (Kiwify)</label>
                <input required type="url" value={kiwifyLink} onChange={e => setKiwifyLink(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="https://kiwify.com.br/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Capa da Imagem</label>
                <input type="url" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="https://..." />
                {coverUrl && <img src={coverUrl} alt="Preview" className="mt-3 h-32 rounded border border-gray-200" />}
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
              <button type="submit" onClick={handleSave} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
