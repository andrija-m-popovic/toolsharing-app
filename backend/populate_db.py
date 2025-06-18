#!/usr/bin/env python3.11

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app
from src.models.user import db, User, Category, Tool, ToolImage
from datetime import datetime

def populate_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating categories...")
        
        # Create categories
        categories = [
            {
                'name': 'Power Tools',
                'description': 'Electric and battery-powered tools for construction and DIY projects',
                'icon_url': '/icons/power-tools.svg'
            },
            {
                'name': 'Hand Tools',
                'description': 'Manual tools for precision work and general maintenance',
                'icon_url': '/icons/hand-tools.svg'
            },
            {
                'name': 'Garden Tools',
                'description': 'Tools for gardening, landscaping, and outdoor maintenance',
                'icon_url': '/icons/garden-tools.svg'
            },
            {
                'name': 'Construction Tools',
                'description': 'Heavy-duty tools for construction and building projects',
                'icon_url': '/icons/construction-tools.svg'
            },
            {
                'name': 'Automotive Tools',
                'description': 'Specialized tools for vehicle maintenance and repair',
                'icon_url': '/icons/automotive-tools.svg'
            }
        ]
        
        category_objects = []
        for cat_data in categories:
            category = Category(**cat_data)
            db.session.add(category)
            category_objects.append(category)
        
        db.session.commit()
        print(f"Created {len(categories)} categories")
        
        print("Creating sample users...")
        
        # Create sample users
        users_data = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'full_name': 'John Doe',
                'location': 'Niš Center',
                'phone_number': '+381 18 123 456',
                'is_verified': True
            },
            {
                'username': 'maria_smith',
                'email': 'maria@example.com',
                'full_name': 'Maria Smith',
                'location': 'Medijana',
                'phone_number': '+381 18 234 567',
                'is_verified': True
            },
            {
                'username': 'stefan_petrovic',
                'email': 'stefan@example.com',
                'full_name': 'Stefan Petrović',
                'location': 'Pantelej',
                'phone_number': '+381 18 345 678',
                'is_verified': True
            },
            {
                'username': 'ana_milic',
                'email': 'ana@example.com',
                'full_name': 'Ana Milić',
                'location': 'Crveni Krst',
                'phone_number': '+381 18 456 789',
                'is_verified': True
            },
            {
                'username': 'marko_jovanovic',
                'email': 'marko@example.com',
                'full_name': 'Marko Jovanović',
                'location': 'Niš Center',
                'phone_number': '+381 18 567 890',
                'is_verified': True
            },
            {
                'username': 'petar_nikolic',
                'email': 'petar@example.com',
                'full_name': 'Petar Nikolić',
                'location': 'Dušanovac',
                'phone_number': '+381 18 678 901',
                'is_verified': True
            }
        ]
        
        user_objects = []
        for user_data in users_data:
            user = User(**user_data)
            user.set_password('password123')  # Default password for demo
            db.session.add(user)
            user_objects.append(user)
        
        db.session.commit()
        print(f"Created {len(users_data)} users")
        
        print("Creating sample tools...")
        
        # Create sample tools with real images
        tools_data = [
            {
                'owner_id': 1,  # john_doe
                'category_id': 1,  # Power Tools
                'name': 'DEWALT 20V Cordless Drill',
                'brand_model': 'DEWALT DCD771C2',
                'description': 'Professional grade cordless drill perfect for home improvement projects. Includes battery, charger, and drill bits set. Lightweight design with LED light for dark spaces.',
                'condition': 'Excellent',
                'price_per_hour': 2.0,
                'price_per_day': 8.0,
                'price_per_week': 45.0,
                'security_deposit': 50.0,
                'pickup_delivery_options': 'Pickup only',
                'images': ['/src/assets/tools/power-tools/dewalt-drill-1.jpg']
            },
            {
                'owner_id': 2,  # maria_smith
                'category_id': 1,  # Power Tools
                'name': 'Ryobi Circular Saw',
                'brand_model': 'Ryobi R18CS-0',
                'description': 'Powerful circular saw for cutting wood, plywood, and other materials. 18V battery powered with depth adjustment and bevel cutting capability.',
                'condition': 'Very Good',
                'price_per_hour': 3.0,
                'price_per_day': 12.0,
                'price_per_week': 70.0,
                'security_deposit': 75.0,
                'pickup_delivery_options': 'Pickup or delivery within 5km',
                'images': ['/src/assets/tools/power-tools/ryobi-circular-saw-1.jpg']
            },
            {
                'owner_id': 3,  # stefan_petrovic
                'category_id': 2,  # Hand Tools
                'name': 'Professional Hammer Set',
                'brand_model': 'Stanley FatMax',
                'description': 'High-quality claw hammer with anti-vibration handle. Perfect for framing, demolition, and general construction work.',
                'condition': 'Good',
                'price_per_hour': 1.0,
                'price_per_day': 3.0,
                'price_per_week': 15.0,
                'security_deposit': 20.0,
                'pickup_delivery_options': 'Pickup only',
                'images': ['/src/assets/tools/hand-tools/claw-hammer-1.jpg']
            },
            {
                'owner_id': 4,  # ana_milic
                'category_id': 1,  # Power Tools
                'name': 'Bosch Orbital Sander',
                'brand_model': 'Bosch PSS 200 AC',
                'description': 'Compact orbital sander for smooth finishing of wood surfaces. Includes dust collection system and various grit sandpaper.',
                'condition': 'Excellent',
                'price_per_hour': 2.5,
                'price_per_day': 10.0,
                'price_per_week': 55.0,
                'security_deposit': 40.0,
                'pickup_delivery_options': 'Pickup or delivery within 3km',
                'images': ['/src/assets/tools/power-tools/bosch-orbital-sander-1.jpg']
            },
            {
                'owner_id': 5,  # marko_jovanovic
                'category_id': 2,  # Hand Tools
                'name': 'Metric Wrench Set',
                'brand_model': 'Craftsman Professional',
                'description': 'Complete set of metric wrenches from 8mm to 24mm. Chrome vanadium steel construction with mirror finish.',
                'condition': 'Very Good',
                'price_per_hour': 1.5,
                'price_per_day': 5.0,
                'price_per_week': 25.0,
                'security_deposit': 30.0,
                'pickup_delivery_options': 'Pickup only',
                'images': ['/src/assets/tools/hand-tools/metric-wrench-set-1.jpg']
            },
            {
                'owner_id': 6,  # petar_nikolic
                'category_id': 3,  # Garden Tools
                'name': 'Electric Lawn Mower',
                'brand_model': 'Black+Decker MM2000',
                'description': 'Corded electric lawn mower with 13-amp motor. 20-inch cutting deck with height adjustment. Perfect for medium-sized lawns.',
                'condition': 'Good',
                'price_per_hour': 4.0,
                'price_per_day': 15.0,
                'price_per_week': 85.0,
                'security_deposit': 100.0,
                'pickup_delivery_options': 'Pickup or delivery within 10km',
                'images': ['/src/assets/tools/garden-tools/electric-lawn-mower-1.jpg']
            },
            {
                'owner_id': 1,  # john_doe
                'category_id': 4,  # Construction Tools
                'name': 'Professional Level Set',
                'brand_model': 'Stabila Type 196',
                'description': 'Precision spirit level set with magnetic base. Includes 24", 48", and torpedo levels for accurate measurements.',
                'condition': 'Excellent',
                'price_per_hour': 1.0,
                'price_per_day': 4.0,
                'price_per_week': 20.0,
                'security_deposit': 25.0,
                'pickup_delivery_options': 'Pickup only',
                'images': ['/src/assets/tools/construction-tools/stabila-level-1.jpg']
            },
            {
                'owner_id': 2,  # maria_smith
                'category_id': 5,  # Automotive Tools
                'name': 'Hydraulic Car Jack',
                'brand_model': 'Craftsman 2.25 Ton',
                'description': 'Heavy-duty hydraulic floor jack for lifting vehicles. 2.25 ton capacity with safety valve and wide base for stability.',
                'condition': 'Very Good',
                'price_per_hour': 3.0,
                'price_per_day': 12.0,
                'price_per_week': 65.0,
                'security_deposit': 80.0,
                'pickup_delivery_options': 'Pickup only',
                'images': ['/src/assets/tools/automotive-tools/hydraulic-car-jack-1.jpg']
            }
        ]
        
        for tool_data in tools_data:
            images = tool_data.pop('images')
            tool = Tool(**tool_data)
            db.session.add(tool)
            db.session.flush()  # Get the tool ID
            
            # Add images
            for i, image_url in enumerate(images):
                image = ToolImage(
                    tool_id=tool.id,
                    image_url=image_url,
                    is_primary=(i == 0)
                )
                db.session.add(image)
        
        db.session.commit()
        print(f"Created {len(tools_data)} tools with images")
        
        print("Database populated successfully!")
        print("\nSample login credentials:")
        print("Email: john@example.com, Password: password123")
        print("Email: maria@example.com, Password: password123")
        print("Email: stefan@example.com, Password: password123")

if __name__ == '__main__':
    populate_database()

