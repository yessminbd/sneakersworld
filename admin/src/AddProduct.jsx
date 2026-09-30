import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    // Pré-rempli avec "un vrai produit" pour tester
    const [name, setName] = useState('Adidas Superstar');
    const [description, setDescription] = useState('Baskets Adidas Superstar classiques blanches avec les bandes noires.');
    const [price, setPrice] = useState('120');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Adidas');
    const [sizes, setSizes] = useState(['40', '41', '42', '43']);
    const [colors, setColors] = useState(['White', 'Black']);
    
    const [image1, setImage1] = useState(null);

    const availableSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
    const availableColors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Grey"];

    const toggleSize = (size) => {
        if (sizes.includes(size)) {
            setSizes(sizes.filter(s => s !== size));
        } else {
            setSizes([...sizes, size]);
        }
    };

    const toggleColor = (color) => {
        if (colors.includes(color)) {
            setColors(colors.filter(c => c !== color));
        } else {
            setColors([...colors, color]);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("colors", JSON.stringify(colors));
            formData.append("popular", "true"); 

            if (image1) formData.append("image1", image1);

            // Appel au backend
            const response = await axios.post("http://localhost:4000/api/product/add", formData);
            if (response.data.success) {
                alert("✅ Produit 'Adidas Superstar' ajouté avec succès dans MongoDB !");
                // Reset après succès
                setName('');
                setDescription('');
                setPrice('');
                setSizes([]);
                setColors([]);
                setImage1(null);
            } else {
                alert("❌ Erreur: " + response.data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Erreur de connexion au serveur backend (assurez-vous que le backend tourne sur le port 4000).");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2>Ajouter un Produit Test</h2>

            <div>
                <label>Nom du Produit</label><br />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
                <label>Description</label><br />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
                <label>Prix (€)</label><br />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <label>Catégorie</label><br />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>

                <div>
                    <label>Sous-catégorie (Marque)</label><br />
                    <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={{ padding: '8px' }}>
                        <option value="Adidas">Adidas</option>
                        <option value="Nike">Nike</option>
                        <option value="Puma">Puma</option>
                        <option value="New Balance">New Balance</option>
                    </select>
                </div>
            </div>

            <div>
                <label>Couleurs disponibles</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                    {availableColors.map(color => (
                        <div
                            key={color}
                            onClick={() => toggleColor(color)}
                            style={{
                                padding: '5px 15px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                backgroundColor: colors.includes(color) ? '#000' : '#f9f9f9',
                                color: colors.includes(color) ? '#fff' : '#000',
                                fontWeight: colors.includes(color) ? 'bold' : 'normal'
                            }}
                        >
                            {color}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label>Tailles disponibles</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                    {availableSizes.map(size => (
                        <div
                            key={size}
                            onClick={() => toggleSize(size)}
                            style={{
                                padding: '5px 15px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                backgroundColor: sizes.includes(size) ? '#000' : '#f9f9f9',
                                color: sizes.includes(size) ? '#fff' : '#000',
                                fontWeight: sizes.includes(size) ? 'bold' : 'normal'
                            }}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label>Image Principale</label><br />
                <input type="file" onChange={(e) => setImage1(e.target.files[0])} required />
            </div>

            <button type="submit" style={{ padding: '12px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', border: 'none', fontWeight: 'bold', borderRadius: '5px' }}>
                AJOUTER CE PRODUIT
            </button>
        </form>
    );
};

export default AddProduct;
