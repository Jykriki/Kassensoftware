// Kassen-Website JavaScript
class Schulkasse {
    constructor() {
        this.categories = [];
        this.products = [];
        this.cart = [];
        this.settings = {
            schoolName: 'Schule',
            currency: '€',
            taxRate: 0,
            printReceipt: false
        };
        this.sales = [];
        this.categoryChart = null;
        this.editingCategoryId = null;
        this.editingProductId = null;
        this.pendingConfirmation = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderCategories();
        this.updateCart();
        this.loadSettings();
    }

    // Data Management
    loadData() {
        const savedCategories = localStorage.getItem('schulkasse_categories');
        const savedProducts = localStorage.getItem('schulkasse_products');
        const savedSales = localStorage.getItem('schulkasse_sales');
        const savedSettings = localStorage.getItem('schulkasse_settings');

        if (savedCategories) this.categories = JSON.parse(savedCategories);
        if (savedProducts) this.products = JSON.parse(savedProducts);
        if (savedSales) this.sales = JSON.parse(savedSales);
        if (savedSettings) this.settings = { ...this.settings, ...JSON.parse(savedSettings) };

        // No sample data - start with empty categories
    }

    saveData() {
        localStorage.setItem('schulkasse_categories', JSON.stringify(this.categories));
        localStorage.setItem('schulkasse_products', JSON.stringify(this.products));
        localStorage.setItem('schulkasse_sales', JSON.stringify(this.sales));
        localStorage.setItem('schulkasse_settings', JSON.stringify(this.settings));
    }

    // Sample data function removed - start with empty categories

    // Event Listeners
    setupEventListeners() {
        // Modal controls
        document.getElementById('settingsBtn').addEventListener('click', () => this.openModal('settingsModal'));
        document.getElementById('statsBtn').addEventListener('click', () => this.openModal('statsModal'));
        
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Settings tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add buttons
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.openModal('addCategoryModal'));
        document.getElementById('addProductBtn').addEventListener('click', () => this.openModal('addProductModal'));

        // Save buttons
        document.getElementById('saveCategoryBtn').addEventListener('click', () => this.handleCategorySave());
        document.getElementById('saveProductBtn').addEventListener('click', () => this.handleProductSave());

        // Cancel buttons
        document.getElementById('cancelCategoryBtn').addEventListener('click', () => this.closeModal('addCategoryModal'));
        document.getElementById('cancelProductBtn').addEventListener('click', () => this.closeModal('addProductModal'));

        // Cart controls
        document.getElementById('clearCartBtn').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Settings form
        document.getElementById('schoolName').addEventListener('change', (e) => {
            this.settings.schoolName = e.target.value;
            this.saveData();
        });

        document.getElementById('currency').addEventListener('change', (e) => {
            this.settings.currency = e.target.value;
            this.saveData();
            this.updateCart();
            this.renderCategories();
        });

        document.getElementById('taxRate').addEventListener('change', (e) => {
            this.settings.taxRate = parseFloat(e.target.value) || 0;
            this.saveData();
            this.updateCart();
        });

        document.getElementById('printReceipt').addEventListener('change', (e) => {
            this.settings.printReceipt = e.target.checked;
            this.saveData();
        });

        // Reset and export buttons
        document.getElementById('resetDataBtn').addEventListener('click', () => this.resetAllData());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());

        // Confirmation modal buttons
        document.getElementById('closeConfirmationBtn').addEventListener('click', () => this.closeModal('confirmationModal'));
        document.getElementById('confirmYesBtn').addEventListener('click', () => this.executeConfirmation());
        document.getElementById('confirmNoBtn').addEventListener('click', () => this.closeModal('confirmationModal'));
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        if (modalId === 'settingsModal') {
            this.loadSettings();
            this.renderSettingsLists();
        } else if (modalId === 'addProductModal') {
            this.loadCategorySelect();
        } else if (modalId === 'statsModal') {
            this.loadStats();
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Clear form fields
        if (modalId === 'addCategoryModal') {
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryColor').value = '#4CAF50';
            document.getElementById('categoryCosts').value = '';
            this.resetCategoryModal();
        } else if (modalId === 'addProductModal') {
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productStock').value = '999';
            this.resetProductModal();
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    // Categories Management
    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        
        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>Keine Kategorien vorhanden</h3>
                    <p>Erstellen Sie Ihre erste Kategorie in den Einstellungen.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.categories.map(category => {
            const categoryProducts = this.products.filter(p => p.categoryId === category.id);
            
            if (categoryProducts.length === 0) {
                            return `
                <div class="category">
                    <div class="category-header" style="background-color: ${category.color}">
                        <span>${category.name}</span>
                    </div>
                    <div class="category-products">
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>Keine Produkte</h3>
                        </div>
                    </div>
                </div>
            `;
            }

            return `
                <div class="category">
                    <div class="category-header" style="background-color: ${category.color}">
                        <span>${category.name}</span>
                    </div>
                    <div class="category-products">
                        ${categoryProducts.map(product => `
                            <button class="product-btn" onclick="kasse.addToCart(${product.id})" 
                                    ${product.stock <= 0 ? 'disabled' : ''}>
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">${product.price.toFixed(2)} ${this.settings.currency}</div>
                                <div class="product-stock">${product.stock > 0 ? `${product.stock} verfügbar` : 'Ausverkauft'}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    addCategory() {
        const name = document.getElementById('categoryName').value.trim();
        const color = document.getElementById('categoryColor').value;
        const costs = parseFloat(document.getElementById('categoryCosts').value) || 0;

        if (!name) {
            this.showNotification('Bitte geben Sie einen Kategorienamen ein.', 'error');
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: name,
            color: color,
            costs: costs
        };

        this.categories.push(newCategory);
        this.saveData();
        this.renderCategories();
        this.renderSettingsLists(); // Update settings lists immediately
        this.closeModal('addCategoryModal');
        this.showNotification('Kategorie erfolgreich erstellt!');
    }

    deleteCategory(categoryId) {
        this.showConfirmation('Sind Sie sicher, dass Sie diese Kategorie löschen möchten? Alle zugehörigen Produkte werden ebenfalls gelöscht.', () => {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.products = this.products.filter(p => p.categoryId !== categoryId);
            this.saveData();
            this.renderCategories();
            this.renderSettingsLists(); // Update settings lists immediately
            this.showNotification('Kategorie erfolgreich gelöscht!');
        });
    }

    // Products Management
    renderSettingsLists() {
        this.renderCategoriesList();
        this.renderProductsList();
    }

    renderCategoriesList() {
        const container = document.getElementById('categoriesList');
        container.innerHTML = this.categories.map(category => `
            <div class="setting-item">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: ${category.color}; border-radius: 4px;"></div>
                        <span>${category.name}</span>
                    </div>
                    <small style="color: #718096;">
                        ${this.products.filter(p => p.categoryId === category.id).length} Produkte
                        ${category.costs > 0 ? `• Kosten: ${category.costs.toFixed(2)} ${this.settings.currency}` : ''}
                    </small>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" onclick="kasse.editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="kasse.deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderProductsList() {
        const container = document.getElementById('productsList');
        container.innerHTML = this.products.map(product => {
            const category = this.categories.find(c => c.id === product.categoryId);
            return `
                <div class="setting-item">
                    <div>
                        <div style="font-weight: 500;">${product.name}</div>
                        <small style="color: #718096;">
                            ${category ? category.name : 'Unbekannte Kategorie'} • 
                            ${product.price.toFixed(2)} ${this.settings.currency} • 
                            ${product.stock} verfügbar
                        </small>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="kasse.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="kasse.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadCategorySelect() {
        const select = document.getElementById('productCategory');
        select.innerHTML = this.categories.map(category => 
            `<option value="${category.id}">${category.name}</option>`
        ).join('');
    }

    addProduct() {
        const name = document.getElementById('productName').value.trim();
        const categoryId = parseInt(document.getElementById('productCategory').value);
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);

        if (!name || !categoryId || isNaN(price) || price < 0) {
            this.showNotification('Bitte füllen Sie alle Felder korrekt aus.', 'error');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: name,
            categoryId: categoryId,
            price: price,
            stock: stock
        };

        this.products.push(newProduct);
        this.saveData();
        this.renderCategories();
        this.renderSettingsLists(); // Update settings lists immediately
        this.closeModal('addProductModal');
        this.showNotification('Produkt erfolgreich erstellt!');
    }

    deleteProduct(productId) {
        this.showConfirmation('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?', () => {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveData();
            this.renderCategories();
            this.renderSettingsLists(); // Update settings lists immediately
            this.showNotification('Produkt erfolgreich gelöscht!');
        });
    }

    // Cart Management
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock <= 0) return;

        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                this.showNotification('Keine weiteren Produkte verfügbar.', 'error');
                return;
            }
        } else {
            this.cart.push({
                productId: productId,
                quantity: 1
            });
        }

        this.updateCart();
        this.showNotification(`${product.name} zum Warenkorb hinzugefügt!`);
    }

    updateCart() {
        const container = document.getElementById('cartItems');
        const totalElement = document.getElementById('totalPrice');
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Warenkorb ist leer</h3>
                    <p>Fügen Sie Produkte hinzu, um zu beginnen.</p>
                </div>
            `;
            totalElement.textContent = `0,00 ${this.settings.currency}`;
            return;
        }

        let total = 0;
        container.innerHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            const category = this.categories.find(c => c.id === product.categoryId);
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-category">${category ? category.name : 'Unbekannt'}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="kasse.updateQuantity(${item.productId}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="kasse.updateQuantity(${item.productId}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">${itemTotal.toFixed(2)} ${this.settings.currency}</div>
                </div>
            `;
        }).join('');

        // Apply tax if configured
        if (this.settings.taxRate > 0) {
            const tax = total * (this.settings.taxRate / 100);
            total += tax;
        }

        totalElement.textContent = `${total.toFixed(2)} ${this.settings.currency}`;
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.productId === productId);
        const product = this.products.find(p => p.id === productId);
        
        if (!item || !product) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            this.cart = this.cart.filter(item => item.productId !== productId);
        } else if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
        } else {
            this.showNotification('Keine weiteren Produkte verfügbar.', 'error');
            return;
        }

        this.updateCart();
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        this.showConfirmation('Sind Sie sicher, dass Sie den Warenkorb leeren möchten?', () => {
            this.cart = [];
            this.updateCart();
            this.showNotification('Warenkorb geleert!');
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Warenkorb ist leer!', 'error');
            return;
        }

        // Create sale record
        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: this.cart.map(item => {
                const product = this.products.find(p => p.id === item.productId);
                return {
                    ...item,
                    productName: product.name,
                    price: product.price
                };
            }),
            total: this.calculateTotal()
        };

        // Update stock
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.stock -= item.quantity;
            }
        });

        // Save data
        this.sales.push(sale);
        this.saveData();

        // Print receipt if enabled
        if (this.settings.printReceipt) {
            this.printReceipt(sale);
        }

        // Clear cart
        this.cart = [];
        this.updateCart();
        this.renderCategories();

        this.showNotification('Kauf erfolgreich abgeschlossen!');
    }

    calculateTotal() {
        let total = this.cart.reduce((sum, item) => {
            const product = this.products.find(p => p.id === item.productId);
            return sum + (product.price * item.quantity);
        }, 0);

        if (this.settings.taxRate > 0) {
            total += total * (this.settings.taxRate / 100);
        }

        return total;
    }

    // Settings Management
    loadSettings() {
        document.getElementById('schoolName').value = this.settings.schoolName;
        document.getElementById('currency').value = this.settings.currency;
        document.getElementById('taxRate').value = this.settings.taxRate;
        document.getElementById('printReceipt').checked = this.settings.printReceipt;
    }

    // Statistics
    loadStats() {
        const today = new Date().toDateString();
        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        );

        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const todayTransactions = todaySales.length;

        // Calculate total costs and profit
        const totalCosts = this.categories.reduce((sum, category) => sum + (category.costs || 0), 0);
        const totalProfit = todayTotal - totalCosts;

        // Find top product
        const productSales = {};
        this.sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productSales[item.productName]) {
                    productSales[item.productName] = 0;
                }
                productSales[item.productName] += item.quantity;
            });
        });

        const topProduct = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)[0];

        // Update stats display
        document.getElementById('todaySales').textContent = `${todayTotal.toFixed(2)} ${this.settings.currency}`;
        document.getElementById('todayTransactions').textContent = todayTransactions;
        document.getElementById('topProduct').textContent = topProduct ? topProduct[0] : '-';

        // Add profit display
        this.updateProfitDisplay(totalProfit, totalCosts);

        // Simple chart
        this.renderCategoryChart();
    }

    updateProfitDisplay(profit, costs) {
        const statsGrid = document.querySelector('.stats-grid');
        
        // Check if profit card already exists
        let profitCard = document.getElementById('profitCard');
        if (!profitCard) {
            profitCard = document.createElement('div');
            profitCard.id = 'profitCard';
            profitCard.className = 'stat-card';
            statsGrid.appendChild(profitCard);
        }

        const profitColor = profit >= 0 ? '#4CAF50' : '#F44336';
        const profitIcon = profit >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        profitCard.innerHTML = `
            <h3>Gewinn</h3>
            <div class="stat-value" style="color: ${profitColor};">${profit.toFixed(2)} ${this.settings.currency}</div>
            <div class="stat-label">Kosten: ${costs.toFixed(2)} ${this.settings.currency}</div>
        `;
    }

    renderCategoryChart() {
        const container = document.getElementById('categoryChart');
        const categorySales = {};

        this.sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = this.products.find(p => p.id === item.productId);
                const category = this.categories.find(c => c.id === product.categoryId);
                const categoryName = category ? category.name : 'Unbekannt';
                
                if (!categorySales[categoryName]) {
                    categorySales[categoryName] = 0;
                }
                categorySales[categoryName] += item.quantity * item.price;
            });
        });

        if (Object.keys(categorySales).length === 0) {
            container.innerHTML = '<p>Noch keine Verkaufsdaten vorhanden.</p>';
            return;
        }

        // Clear previous chart
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        // Prepare data for Chart.js
        const labels = Object.keys(categorySales);
        const data = Object.values(categorySales);
        const colors = this.generateChartColors(labels.length);

        // Calculate profits for each category
        const profits = labels.map(categoryName => {
            const category = this.categories.find(c => c.name === categoryName);
            const sales = categorySales[categoryName];
            const costs = category ? (category.costs || 0) : 0;
            return sales - costs;
        });

        // Create canvas for chart
        container.innerHTML = '<canvas id="categoryChartCanvas" width="400" height="300"></canvas>';

        // Create pie chart
        const ctx = document.getElementById('categoryChartCanvas').getContext('2d');
        this.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                const category = this.categories.find(c => c.name === label);
                                const costs = category ? (category.costs || 0) : 0;
                                const profit = value - costs;
                                const profitText = profit >= 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2);
                                
                                return [
                                    `${label}: ${value.toFixed(2)} ${this.settings.currency} (${percentage}%)`,
                                    `Kosten: ${costs.toFixed(2)} ${this.settings.currency}`,
                                    `Gewinn: ${profitText} ${this.settings.currency}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    generateChartColors(count) {
        const baseColors = [
            '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
            '#00BCD4', '#FF5722', '#795548', '#607D8B', '#E91E63'
        ];
        
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    }

    // Receipt Printing
    printReceipt(sale) {
        const receipt = `
            <div style="font-family: monospace; padding: 20px; max-width: 300px;">
                <h2 style="text-align: center; margin-bottom: 20px;">${this.settings.schoolName}</h2>
                <div style="border-bottom: 1px solid #ccc; margin-bottom: 20px;"></div>
                <div style="margin-bottom: 20px;">
                    <div>Datum: ${new Date(sale.date).toLocaleDateString('de-DE')}</div>
                    <div>Zeit: ${new Date(sale.date).toLocaleTimeString('de-DE')}</div>
                    <div>Beleg-Nr: ${sale.id}</div>
                </div>
                <div style="margin-bottom: 20px;">
                    ${sale.items.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>${item.productName} x${item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)} ${this.settings.currency}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top: 1px solid #ccc; padding-top: 10px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold;">
                        <span>Gesamt:</span>
                        <span>${sale.total.toFixed(2)} ${this.settings.currency}</span>
                    </div>
                </div>
                <div style="text-align: center; font-size: 0.9em; color: #666;">
                    Vielen Dank für Ihren Einkauf!
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Beleg</title>
                    <style>
                        body { margin: 0; padding: 20px; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>${receipt}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Utility Functions
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    showConfirmation(message, callback) {
        this.pendingConfirmation = callback;
        document.getElementById('confirmationMessage').textContent = message;
        this.openModal('confirmationModal');
    }

    executeConfirmation() {
        if (this.pendingConfirmation) {
            this.pendingConfirmation();
            this.pendingConfirmation = null;
        }
        this.closeModal('confirmationModal');
    }

    // Save functions (called from event listeners)
    saveCategory() {
        this.addCategory();
    }

    saveProduct() {
        this.addProduct();
    }

    // Edit Functions
    editCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        // Set editing mode
        this.editingCategoryId = categoryId;

        // Fill form with existing data
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryColor').value = category.color;
        document.getElementById('categoryCosts').value = category.costs || '';

        // Change modal title and button
        document.querySelector('#addCategoryModal .modal-header h2').innerHTML = '<i class="fas fa-edit"></i> Kategorie bearbeiten';
        document.getElementById('saveCategoryBtn').textContent = 'Aktualisieren';

        this.openModal('addCategoryModal');
    }

    updateCategory(categoryId) {
        const name = document.getElementById('categoryName').value.trim();
        const color = document.getElementById('categoryColor').value;
        const costs = parseFloat(document.getElementById('categoryCosts').value) || 0;

        if (!name) {
            this.showNotification('Bitte geben Sie einen Kategorienamen ein.', 'error');
            return;
        }

        const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
            this.categories[categoryIndex] = {
                ...this.categories[categoryIndex],
                name: name,
                color: color,
                costs: costs
            };

            this.saveData();
            this.renderCategories();
            this.renderSettingsLists();
            this.closeModal('addCategoryModal');
            this.showNotification('Kategorie erfolgreich aktualisiert!');
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Set editing mode
        this.editingProductId = productId;

        // Fill form with existing data
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;

        // Set category in dropdown
        this.loadCategorySelect();
        document.getElementById('productCategory').value = product.categoryId;

        // Change modal title and button
        document.querySelector('#addProductModal .modal-header h2').innerHTML = '<i class="fas fa-edit"></i> Produkt bearbeiten';
        document.getElementById('saveProductBtn').textContent = 'Aktualisieren';

        this.openModal('addProductModal');
    }

    updateProduct(productId) {
        const name = document.getElementById('productName').value.trim();
        const categoryId = parseInt(document.getElementById('productCategory').value);
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);

        if (!name || !categoryId || isNaN(price) || price < 0) {
            this.showNotification('Bitte füllen Sie alle Felder korrekt aus.', 'error');
            return;
        }

        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                name: name,
                categoryId: categoryId,
                price: price,
                stock: stock
            };

            this.saveData();
            this.renderCategories();
            this.renderSettingsLists();
            this.closeModal('addProductModal');
            this.showNotification('Produkt erfolgreich aktualisiert!');
        }
    }

    handleCategorySave() {
        if (this.editingCategoryId !== null) {
            this.updateCategory(this.editingCategoryId);
            this.editingCategoryId = null;
        } else {
            this.addCategory();
        }
    }

    handleProductSave() {
        if (this.editingProductId !== null) {
            this.updateProduct(this.editingProductId);
            this.editingProductId = null;
        } else {
            this.addProduct();
        }
    }

    resetCategoryModal() {
        document.querySelector('#addCategoryModal .modal-header h2').innerHTML = '<i class="fas fa-folder-plus"></i> Neue Kategorie';
        document.getElementById('saveCategoryBtn').textContent = 'Speichern';
        this.editingCategoryId = null;
    }

    resetProductModal() {
        document.querySelector('#addProductModal .modal-header h2').innerHTML = '<i class="fas fa-plus"></i> Neues Produkt';
        document.getElementById('saveProductBtn').textContent = 'Speichern';
        this.editingProductId = null;
    }

    // Data Management Functions
    resetAllData() {
        const confirmMessage = `Sind Sie sicher, dass Sie ALLE Daten zurücksetzen möchten?

Dies wird löschen:
• Alle Kategorien
• Alle Produkte
• Alle Verkaufsdaten
• Alle Einstellungen

Diese Aktion kann NICHT rückgängig gemacht werden!`;

        this.showConfirmation(confirmMessage, () => {
            // Clear all data
            this.categories = [];
            this.products = [];
            this.cart = [];
            this.sales = [];
            this.settings = {
                schoolName: 'Schule',
                currency: '€',
                taxRate: 0,
                printReceipt: false
            };

            // Clear localStorage
            localStorage.removeItem('schulkasse_categories');
            localStorage.removeItem('schulkasse_products');
            localStorage.removeItem('schulkasse_sales');
            localStorage.removeItem('schulkasse_settings');

            // Reset UI
            this.renderCategories();
            this.updateCart();
            this.loadSettings();

            // Close modal
            this.closeModal('settingsModal');

            this.showNotification('Alle Daten wurden erfolgreich zurückgesetzt!', 'success');
        });
    }

    exportData() {
        const exportData = {
            categories: this.categories,
            products: this.products,
            sales: this.sales,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `schulkasse_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('Daten erfolgreich exportiert!', 'success');
    }
}

// Initialize the application
const kasse = new Schulkasse();

// Global functions for HTML onclick handlers
window.kasse = kasse; 